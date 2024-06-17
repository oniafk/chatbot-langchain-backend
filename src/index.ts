import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { Hono } from "hono";

import { getAllOrders } from "../prisma/controllers/order.controller";

import getRelevantDocuments from "./langchain/chatbot/retrievers/matryoshkaRetriever";
const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:4000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/chatbot", getRelevantDocuments);

app.get("/all-order-info", getAllOrders);

const port = process.env.PORT! || 4000;
console.log(`Running at http://localhost:${port}`);

try {
  serve({
    fetch: app.fetch,
    port,
  });
} catch (error) {
  console.error("Error starting server:", error);
}
