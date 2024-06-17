import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { getAllOrders } from "../prisma/controllers/order.controller";

import getRelevantDocuments from "./langchain/chatbot/retrievers/matryoshkaRetriever";
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/chatbot", getRelevantDocuments);

app.get("/all-order-info", getAllOrders);

const port = process.env.PORT! || 4000;
console.log(`Running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
