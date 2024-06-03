import { MatryoshkaRetriever } from "langchain/retrievers/matryoshka_retriever";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const openAIApiKey = process.env.OPENAI_API_KEY;
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const llm = new ChatOpenAI({ openAIApiKey });

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

interface OriginalInput {
  question: string;
  chat_history: any[]; // Replace any with the actual type if known
}

interface HumanMessage {
  original_input: OriginalInput;
  question: string;
}
interface ChainSequenceProps {
  humanMessage: string;
  chatHistory: string;
}

async function getRelevantDocuments(c: any) {
  const customerMessage = (await c.req.json()) as ChainSequenceProps;

  const { humanMessage, chatHistory } = customerMessage;

  console.log(chatHistory, "chatHistory");

  const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {humanMessage}
Standalone question:`;
  const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
    condenseQuestionTemplate
  );

  const standaloneQuestionChain = RunnableSequence.from([
    CONDENSE_QUESTION_PROMPT,
    llm,
    new StringOutputParser(),
  ]);

  const result1 = await standaloneQuestionChain.invoke({
    chat_history: chatHistory,
    humanMessage: humanMessage,
  });

  const resultQueryVectorStore = await retriever.getRelevantDocuments(result1);

  const results = [resultQueryVectorStore];

  const mergedResults = results.flat();
  const DocumentsToString = mergedResults
    .map(({ pageContent }) => pageContent)
    .join("\n");

  const allDocuments = DocumentsToString;

  return c.json(allDocuments);
}

export default getRelevantDocuments;
