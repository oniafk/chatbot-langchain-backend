import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

import loadText from "./textLoader";

const getContextualChunk = async () => {
  try {
    const { text } = await loadText();
    const result = text[0].pageContent;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 50,
      separators: ["#", "-", "\n"],
    });

    const conversationDocs = await splitter.createDocuments([`${result}`], [], {
      chunkHeader: `DOCUMENT NAME: Jim Interview\n\n---\n\n`,
      appendChunkOverlapHeader: true,
    });

    const vectorstore = await HNSWLib.fromDocuments(
      conversationDocs,
      new OpenAIEmbeddings()
    );

    let document = vectorstore.docstore._docs;

    console.log(vectorstore);
  } catch (error) {
    console.log(error);
  }
};

export default getContextualChunk;
