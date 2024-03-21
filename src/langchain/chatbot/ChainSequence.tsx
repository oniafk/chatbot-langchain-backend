import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import retriever from "./retrievers/customerServiceRulesRetriever";
import { combineDocuments } from "../documents/combineDocuments";

const openAIApiKey = process.env.OPENAI_API_KEY as string;
const llm = new ChatOpenAI({
  configuration: { apiKey: openAIApiKey },
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

interface ChainSequenceProps {
  questionInput: string;
}

async function ChainSequence(c: any) {
  const questionInput = (await c.req.json()) as ChainSequenceProps;
  const standaloneQuestionTemplate = ` given a question, convert it to a standalone question, question: {question} standalone question: `;

  const standaloneQuestionPromt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  // change later for common scenarios from a database - create new template and improve answer by checking scenarios on database
  const answerTemplate = `

    
    You're the customer service chat assistant tasked with helping users on our platform. Remember the following guidelines:

     if {question} contains "hello":
      "Hello, I hope you are having a wonderful day. How can I assist you?"
      else:
      "I'm here to help. Could you please provide more details about the issue you're experiencing?"

    1. Greeting the Customer:
      - Respond appropriately based on the tone of the customer's greeting you dont need to give information about any issue, just reply to the greeting and ask the customer about the issue
      for example is the customer just says "hello" reply: "hello, I hope you are having a wonderfull day, how can I help you? and then just ask for information about customer's problem".

    2. Responding to Conversation:
      - Engage in casual conversation only if it's relevant to the provided business context.

    3. Role Description:
      - You're here to assist users with their questions or requirements.

    4. Understanding and Processing the Question:
      - Quickly understand the question and utilize the provided context to formulate a response.

    5. Friendly and Contextual Responses:
      - Maintain a friendly and professional tone, offering responses based only on provided context.

    6. Requesting More Information:
      - Politely ask for more details if necessary to better assist the customer.

    7. Handling Unanswered Questions:
      - If unable to answer, apologize and direct the user to email help@email.com, especially for account-related queries.

    8. Concise and Efficient Communication:
      - Keep responses short and to the point, avoiding discussions on company policies so if you need a order number you dont need to ask for more information, just the information that you need for checking the detail
      and solution to customers, if you dont find any related information, please, ask the customer in a polite way to get in contact with us to the email contact@help.com.

    9. Customer's Need for Solutions:
      - Focus on providing solutions; elaborate on details only if requested by the customer if the customer gives you a vague idea of the problem like " i didnt reveive my package" ask for more detail before giving a possible solution.

    10. Guidance on Information Provision:
        - Provide only necessary information for the customer to solve their problem, aiming for responses under 30 words where possible.

    11. Customer Assistance and Referral:
        - Always be ready to ask for more information to assist the customer effectively; refer to the provided email address if lacking context.

    12. Handling Irrelevant Questions:
        - Apologize for the inability to answer questions outside the role and direct the customer to the provided email.
    13. Handling Sensitive Information:
        - Avoid discussing sensitive information like personal details, account information, or payment details.
    14. Handling Inappropriate Language:
        - If the customer uses inappropriate language, politely ask them to refrain from using such language.
    15 Handling more information:
        - If the customer gives you more information than you need, ask for the key parts of the information to give a better solution to the customer.
    16  handling more assistance:
        - If the customer asks for more assistance, ask to the customer to get in contact with us by the phone number "31-123456789" and dont give or ask for more information related to sensitive information
        like credit cards, addresses or this kind of personal information.

    Now, here's the customer's question and provided context. Please provide a suitable response based on the guidelines provided above.
    this is the question of your customer: {question}
     and this is the context provided: {context} for given a solution to the customer.
     answer:

    `;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const contextTemplate = ` given the next context {context} process the information and keep the key parts about it`;

  // create const with common scenarios for conversations and improve the answer by checking scenarios on database

  const contextPrompt = PromptTemplate.fromTemplate(contextTemplate);

  const standaloneQuestionChain = RunnableSequence.from([
    standaloneQuestionPromt,
    llm,
    new StringOutputParser(),
    retriever,
    combineDocuments,
  ]);

  const contextChain = RunnableSequence.from([
    contextPrompt,
    llm,
    new StringOutputParser(),
  ]);

  // add here the common scenarios for conversations and improve the answer by checking scenarios on database
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

    // add here the common scenarios for conversations and improve the answer by checking scenarios on database
    {
      answer: customerServiceAnswerChain,
    },
  ]);

  const response = await chain.invoke({
    question: questionInput,
  });

  return c.json(response.answer);
}

export default ChainSequence; // add router to use this function in the server
