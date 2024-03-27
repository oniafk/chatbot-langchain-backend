import { serve } from "@hono/node-server";
import { Hono } from "hono";

// import { db } from "./langchain/database/sql/index";
// import { agentLLM } from "./langchain/database/sql/agent";
import { createUser } from "../prisma/controllers/user.controller";
import { createPaymentMethod } from "../prisma/controllers/paymentMethod.controller";
import { createProduct } from "../prisma/controllers/product.controller";
import { createCarrier } from "../prisma/controllers/carrier.controller";
import { createStatusDelivery } from "../prisma/controllers/statusDelivery.controller";
import { createOrder } from "../prisma/controllers/order.controller";
import ChainSequence from "./langchain/chatbot/ChainSequence";

import getContextualChunk from "./langchain/documents/customerService/conversationScenarios/contextualChunkHeader";

const app = new Hono();

app.get("/", (c) => {
  getContextualChunk();
  return c.text("Hello Hono!");
});

app.post("/users", createUser);
app.post("/payment-methods", createPaymentMethod);
app.post("/products", createProduct);
app.post("/carriers", createCarrier);
app.post("/status-deliveries", createStatusDelivery);
app.post("/create-order", createOrder);
app.post("/chatbot", ChainSequence);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
