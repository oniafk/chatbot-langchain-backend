import { MatryoshkaRetriever } from "langchain/retrievers/matryoshka_retriever";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getInfo } from "../../../../prisma/requests/userInfo";

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
  tableName: "test_document",
});

const retriever = new MatryoshkaRetriever({
  vectorStore,
  largeEmbeddingModel: largeEmbedding,
  largeK: 3,
});

interface ChainSequenceProps {
  humanMessage: string;
}

async function getRelevantDocuments(c: any) {
  const customerMessage = (await c.req.json()) as ChainSequenceProps;

  const userInfo = await getInfo();

  const message = customerMessage;

  const queryNOsScenarios = `check the documents for the NOs scenarios and and according to the customer message, verify if is asking for something that is not allow to do on the chat, message: ${message}`;

  const queryCustomerServicePolicies = ` check the documents for cursomer service policies and verify the customer message to see if is asking for something that is not allow to do on the chat according to the company policies, message: ${message}`;

  const queryCustomerServiceBehavior = ` check the documents for customer service asociate behavior and according to the message received form the customer get the best way to reply the message, message: ${message}`;

  const queryConversationScenarios = ` check the documents for the conversation scenarios and based on the customer message, use the examples provided to get the best way to reply the customer, message: ${message}`;

  const resultNOsScenarios = await retriever.getRelevantDocuments(
    queryNOsScenarios
  );
  const resultCustomerServicePolicies = await retriever.getRelevantDocuments(
    queryCustomerServicePolicies
  );
  const resultCustomerServiceBehavior = await retriever.getRelevantDocuments(
    queryCustomerServiceBehavior
  );
  const resultConversationScenarios = await retriever.getRelevantDocuments(
    queryConversationScenarios
  );

  const results = [
    resultNOsScenarios,
    resultCustomerServicePolicies,
    resultCustomerServiceBehavior,
    resultConversationScenarios,
  ];

  const mergedResults = results.flat();
  const DocumentsToString = mergedResults
    .map(({ pageContent }) => pageContent)
    .join("\n");

  const allDocuments = DocumentsToString + userInfo;

  return c.json(allDocuments);
}

export default getRelevantDocuments;
