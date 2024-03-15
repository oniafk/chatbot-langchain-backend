import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";

const openAIApiKey = process.env.OPENAI_API_KEY as string;

const embeddings = new OpenAIEmbeddings({ openAIApiKey: openAIApiKey });
const supabaseApiKey = process.env.SUPABASE_API_KEY as string;
const supabaseURL = process.env.SUPABASE_URL as string;
const client = createClient(supabaseURL!, supabaseApiKey!);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents", //table that contains the vectors that we want to search and match information from
  queryName: "document_documents", //query that we want to use to search the table, this is on supabase and can be edited
});

const retriever = vectorStore.asRetriever(); // this is the retriever that we will use to search the table that is defined on the vectorStore const

export default retriever;
