import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import loadText from "./textLoader";
import { Document } from "@langchain/core/documents";

const getSplittedText = async () => {
  try {
    const { text } = await loadText();
    const result = text[0].pageContent;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 50,
      separators: ["#", "-", "\n"],
    });

    const docOutput = await splitter.splitDocuments([
      new Document({ pageContent: result }),
    ]);

    console.log(docOutput);
    return docOutput;
  } catch (error) {
    console.log(error);
  }
};

export default getSplittedText;
