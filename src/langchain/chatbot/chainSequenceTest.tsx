import { ChatOpenAI } from "@langchain/openai";
import { ConversationSummaryBufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
  PromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import getRelevantDocuments from "./retrievers/matryoshkaRetriever";

const openAIApiKey = process.env.OPENAI_API_KEY as string;

const llm = new ChatOpenAI({
  configuration: { apiKey: openAIApiKey },
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

interface ChainSequenceProps {
  questionInput: string;
}

async function ChainSequencetest() {
  const customerMessage =
    "can you let me know the status of my order with the tracking number 1Z012EE34567890123, it says that is lost in transit and I want to check what solution i can got for this?";

  // create templates for chains that we will use in the sequence

  const standaloneQuestionTemplate = ` given a question, convert it to a standalone question, question: {question} standalone question: `;
  const standaloneQuestionPromt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const answerTemplate = ` You're the customer service chat assistant tasked with helping users on our platform. Remember the following guidelines:
    you will receive the documents for follow the the steps for giving the best answer to the customer

    the answer will be based on 4 steps :

    1. check the documents related to the conversation scenarios for examples given to reply the customer,
    this is a example of the conversation that you will have and it will be used as guide for replying the customer message.

    2. check the documents for Customer service policies, this documents provide the rules that you need to follow when replying the customer message.
    it will contain the rules of the company and posibles solutions for customer issues.

    3. check the documents for Customer service behavior, this documents provide a guide for the best way to reply the customer message.
    it will contain the best way to reply the customer message and also it will show the way that you will behave to face the different scenarios that you will have on
    each interaction with the customers.

    4. check the documents for the NOs scenarios, this documents provide the scenarios that you need to avoid when replying the customer message.
    this documents will show the things that you must avoid at the momment of replying the customer message.

    always remember that this documents are a guide for you to give the best answer to the customer, if you dont have the information that you need to reply the customer message
    refeer the customer to get in contact with us to the email: contactus@email.com

    this is the questions and the context that you will use to reply the customer: {question}
    this is the context provided with the documents that you will need to check for providing the answer to the customer {context}, it will include the information that you need to reply the customer message such as policies, guides and customer information.

    remember that you are a customer service chat assistant, you must reply to the customer as you are a person trying to help them, if you will mention any information related to the company, you can always say that the information
    is based on the company policies. 

    if the customer provides the order_tracking_number, you can verify the information that you are going to receive on the {context} and notify the status of the order to the customer this will appear as customerInfo on the context, check the tables and verify the information for being acurate to the info that you receive from the database about the customer.

    - never mention the documents to the customer, just say that the information is based on the company policies.

    if the customer has a problem with the status of the delivery of any order, check the documents a provide the best solution to the customer based on the information that you will get on the documents.

    always remember that if some orders are lost in transit, damaged or delayed, you can give the customer the option to get a refund or a new order, this info is also in the documents
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
    },
    {
      answer: customerServiceAnswerChain,
    },
  ]);

  const response = await chain.invoke({
    question: customerMessage,
  });

  console.log(response);
}

export default ChainSequencetest;
