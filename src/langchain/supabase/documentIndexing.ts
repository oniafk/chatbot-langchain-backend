import { PostgresRecordManager } from "@langchain/community/indexes/postgres";
import { index } from "langchain/indexes";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { PoolConfig } from "pg";

import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

import { v4 as uuidv4 } from "uuid";

import loadText from "../documents/customerService/NosScenarios/textLoader";

const supabaseApiKey = process.env.SUPABASE_API_KEY as string;
const supabaseUrl = process.env.SUPABASE_URL as string;
const openAIApiKey = process.env.OPENAI_API_KEY as string;

const supabaseUser = process.env.SUPABASE_USER as string;
const supabasePassword = process.env.SUPABASE_PASSWORD as string;

const vectorStore = new SupabaseVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: openAIApiKey }),
  {
    client: createClient(supabaseUrl, supabaseApiKey),
    tableName: "documents",
  }
);

const supabaseClient = createClient(supabaseUrl, supabaseApiKey);

const recordManagerConfig = {
  postgresConnectionOptions: {
    port: 5432,
    user: supabaseUser,
    host: "aws-0-ap-southeast-2.pooler.supabase.com",
    type: "postgres",
    password: supabasePassword,
    database: "postgres",
    connectionTimeoutMillis: 10000,
  } as PoolConfig,
  tableName: "upsertion_records",
};

const uuid = uuidv4();

const recordManager = new PostgresRecordManager(uuid, recordManagerConfig);

export async function createSchema() {
  const newSchema = await recordManager.createSchema();
  return newSchema;
}

export const getContextualChunk = async () => {
  try {
    createSchema();
    const { text } = await loadText();
    const result = text[0].pageContent;

    const metadatas = [
      {
        title: "NOs Scenarios",
        description:
          "This document contains the NOs scenarios for the customer service policies. The NOs scenarios are the negative scenarios that the customer service associate should avoid. The NOs scenarios are the scenarios that the customer service associate should not follow and behavior that the customer service associate should not exhibit.",
        source: "4",
      },
    ];

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 50,
      separators: ["#", "-", "\n"],
    });

    const conversationDocs = await splitter.createDocuments(
      [`${result}`],
      metadatas,
      {
        chunkHeader: `DOCUMENT NAME: NOs Scenarios\n\n---\n\n`,
        appendChunkOverlapHeader: true,
      }
    );

    const vectorstore = await HNSWLib.fromDocuments(
      conversationDocs,
      new OpenAIEmbeddings()
    );

    let document = vectorstore.docstore._docs;

    function iterateDocuments(document: any) {
      let documentsArray: any[] = [];
      document.forEach((doc: any) => {
        documentsArray.push(doc);
      });

      return documentsArray;
    }

    let documents = iterateDocuments(document);

    //Indexing documents into vector store and record manager

    async function clear() {
      await index({
        docsSource: documents,
        recordManager,
        vectorStore,
        options: {
          cleanup: "incremental",
          sourceIdKey: "source",
        },
      });
    }

    await clear();

    await recordManager.end();

    return documents;
  } catch (error) {
    console.log(error);
  }
};

export default getContextualChunk;
