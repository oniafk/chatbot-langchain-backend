import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";

const openAIApiKey = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const supabaseApiKey = process.env.SUPABASE_API_KEY;
const supabaseURL = process.env.SUPABASE_URL;
const client = createClient(supabaseURL!, supabaseApiKey!);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents", //table that contains the vectors that we want to search and match information from
  queryName: "match_documents", //query that we want to use to search the table, this is on supabase and can be edited
});

const retriever = vectorStore.asRetriever(); // this is the retriever that we will use to search the table that is defined on the vectorStore const

export default retriever;
