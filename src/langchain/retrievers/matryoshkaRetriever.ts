import { MatryoshkaRetriever } from "langchain/retrievers/matryoshka_retriever";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import loadText from "../documents/customerService/shipments/testLoader";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

const openAiKey = process.env.OPENAI_API_KEY;
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const smallEmbedding = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  dimensions: 512,
});

const largeEmbedding = new OpenAIEmbeddings({
  modelName: "text-embedding-3-large",
  dimensions: 3072,
});

const vectorStore = new SupabaseVectorStore(smallEmbedding, {
  client: createClient(supabaseURL!, supabaseKey!),
  tableName: "documents",
});

const retriever = new MatryoshkaRetriever({
  vectorStore,
  largeEmbeddingModel: largeEmbedding,
});

export const getContextualChunk = async () => {
  const { text } = await loadText();
  const result = text[0].pageContent;

  const metadatas = [
    {
      title: "shipment scenarios",
      description:
        "this document contains the scenarios that you will have when replying the customer message if it ask any information related to delivery of the products, tracking numbers, carriers, etc.",
      source: "5",
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
      chunkHeader: `DOCUMENT NAME: shipment scenarios\n\n---\n\n`,
      appendChunkOverlapHeader: true,
    }
  );

  const hnswlibVectorStore = await HNSWLib.fromDocuments(
    conversationDocs,
    new OpenAIEmbeddings()
  );

  let documentsContextualHeader = hnswlibVectorStore.docstore._docs;

  function iterateDocuments(document: any) {
    let documentsArray: any[] = [];
    document.forEach((doc: any) => {
      documentsArray.push(doc);
    });

    return documentsArray;
  }

  let documents = iterateDocuments(documentsContextualHeader);

  await retriever.addDocuments(documents);

  console.log(documents);
};
