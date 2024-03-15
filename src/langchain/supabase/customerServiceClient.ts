import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import getSpliitedText from "../documents/customerService/textSplitter";

const supabaseApiKey = process.env.SUPABASE_API_KEY as string;
const supabaseUrl = process.env.SUPABASE_URL as string;
const openAIApiKey = process.env.OPENAI_API_KEY as string;

const text = async () => {
  const splittedText = await getSpliitedText();
  return splittedText || [];
};

export const createVectorStore = async () => {
  const supabaseClient = createClient(supabaseUrl, supabaseApiKey);
  const textData = await text();

  if (textData) {
    await SupabaseVectorStore.fromDocuments(
      textData,
      new OpenAIEmbeddings({ openAIApiKey: openAIApiKey }),
      {
        client: supabaseClient,
        tableName: "documents",
      }
    );
  }
};
