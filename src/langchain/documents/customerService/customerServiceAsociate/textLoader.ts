import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new DirectoryLoader(
  "src/langchain/documents/customerService/customerServiceAsociate/",
  {
    ".txt": (path) => new TextLoader(path),
  }
);

export default async function loadText() {
  const text = await loader.load();
  console.log(text);
  return { text };
}
