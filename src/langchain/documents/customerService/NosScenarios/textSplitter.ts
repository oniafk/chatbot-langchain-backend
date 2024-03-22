import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import loadText from "./textLoader";
import { Document } from "@langchain/core/documents";
// verify text Splitter notes and improve the code
const getSplittedText = async () => {
  try {
    const { text } = await loadText();
    const result = text[0].pageContent;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["#"],
    });

    const docOutput = await splitter.splitDocuments([
      new Document({ pageContent: result }),
    ]);

    return docOutput;
  } catch (error) {
    console.log(error);
  }
};

export default getSplittedText;
