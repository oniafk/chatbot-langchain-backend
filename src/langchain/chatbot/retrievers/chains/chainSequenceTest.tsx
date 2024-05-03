import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import getRelevantDocuments from "../matryoshkaRetriever";
import { ChatMessage } from "@langchain/core/messages";

const openAIApiKey = process.env.OPENAI_API_KEY as string;

const llm = new ChatOpenAI({
  configuration: { apiKey: openAIApiKey },
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

interface ChainSequenceProps {
  questionInput: string;
}

async function ChainSequencetest(c: any) {
  const customerMessage = (await c.req.json()) as ChainSequenceProps;

  // create templates for chains that we will use in the sequence

  const standaloneQuestionTemplate = ` given a question, convert it to a standalone question, question: {question} standalone question: `;
  const standaloneQuestionPromt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const answerTemplate = ` As a customer service chat assistant, your primary goal is to ensure that each conversation flows naturally and friendly, following these detailed steps:

  Authentic Conversation Scenarios:
  Dive into the conversation scenarios provided in the documents. These examples will help you understand how to respond authentically to the customer, using a conversational tone that builds trust and empathy. Imagine you're speaking face-to-face with the customer to deliver the best possible experience.
  always try to find the most reliable answer for the customer based on the {question} and the context provided.
  Customer Service Policies:
  Access the customer service policies to understand the rules and guidelines you must follow in your interactions. Use this information {context} to ensure your responses are informative and respectful, while maintaining a natural and pleasant conversational tone.
  Empathetic and Helpful Behavior:
  Familiarize yourself with the guidelines for behavior in customer service that you will see in the {context}. These guides will help you show empathy and willingness to solve problems, creating a conversational experience that feels genuine and reassuring for the customer. Remember, your goal is to help and meet their needs.
  Avoiding Problematic Situations:
  Review the scenarios to avoid to understand which situations you should steer clear of in your responses based on the {context} and the conversation scenarios that you will find in the {context}. This will allow you to address any challenges calmly and professionally, always maintaining a positive and constructive tone in the conversation.
  Remember that each interaction should sound like a real conversation between two people. Use the provided {context} to respond relevantly and personalized to the customer's inquiries. If at any point you find yourself lacking necessary information, offer the customer the option to contact us via our email address: contactus@email.com.
  
  In summary, your aim is to create a friendly and helpful conversation environment where the customer feels heard and valued at all times. Utilize your ability to communicate naturally and empathetically, making each interaction a positive experience for the customer.
  dont forget to check the {history} to keep the flow of the conversation.
  this is the message that you need to reply: {question}:                                       
  `;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const documentsTemplate = `given the next context {context} verify the information that you will get on the documents and reply the customer message `;
  const documentsPrompt = PromptTemplate.fromTemplate(documentsTemplate);

  // create the chain for the sequence

  const standaloneQuestionChain = RunnableSequence.from([
    standaloneQuestionPromt,
    llm,
    new StringOutputParser(),
    getRelevantDocuments,
  ]);

  const contextChain = RunnableSequence.from([
    documentsPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const customerServiceAnswerChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const chain = RunnableSequence.from([
    {
      context: standaloneQuestionChain,
      originalQuestion: new RunnablePassthrough(),
    },
    {
      context: contextChain,
      question: ({ originalQuestion }) => originalQuestion.question,
      memory: ({ context }) => context.memory,
    },
    {
      answer: customerServiceAnswerChain,
    },
  ]);

  const response = await chain.invoke({
    question: customerMessage,
  });

  console.log(customerMessage);
  console.log(response);

  return c.json(response.answer);
}

export default ChainSequencetest;
