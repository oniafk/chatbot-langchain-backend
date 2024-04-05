import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  HNSWLib,
  HNSWLibArgs,
} from "@langchain/community/vectorstores/hnswlib";
import { HierarchicalNSW } from "hnswlib-node";

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
      chunkHeader: `DOCUMENT NAME: conversation scenarios\n\n---\n\n`,
      appendChunkOverlapHeader: true,
    });

    const vectorstore = await HNSWLib.fromDocuments(
      conversationDocs,
      new OpenAIEmbeddings()
    );

    const numDimensions = 4;
    const maxElements = 1000;

    const documents = vectorstore.docstore;
    const args: HNSWLibArgs = {
      space: "cosine",
      numDimensions: numDimensions,
      docstore: documents,
    };

    let hnswlibDocuments = new HNSWLib(new OpenAIEmbeddings(), args);

    let index = new HierarchicalNSW("l2", numDimensions);
    index.initIndex(maxElements, 16, 200, 100);

    hnswlibDocuments._index = index;

    let point = [1, 2, 3, 4];
    let label = 0;

    index.addPoint(point, label);

    let nearestNeighbors = index.searchKnn(point, 2);

    console.log(nearestNeighbors);

    return vectorstore;
  } catch (error) {
    console.log(error);
  }
};

export default getContextualChunk;
