import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { createUser, getUsers } from "../prisma/controllers/user.controller";
import {
  createPaymentMethod,
  getPaymentMethods,
} from "../prisma/controllers/paymentMethod.controller";
import {
  createProduct,
  getProducts,
} from "../prisma/controllers/product.controller";
import {
  createCarrier,
  getCarriersInfo,
} from "../prisma/controllers/carrier.controller";
import {
  createStatusDelivery,
  getStatusDeliveries,
} from "../prisma/controllers/statusDelivery.controller";
import {
  createOrder,
  getOrders,
  getAllOrders,
} from "../prisma/controllers/order.controller";
import ChainSequence from "./langchain/chatbot/ChainSequence";

import ChainSequencetest from "./langchain/chatbot/chainSequenceTest";

const app = new Hono();

app.get("/", (c) => {
  ChainSequencetest();
  return c.text("Hello Hono!");
});

app.post("/users", createUser);
app.post("/payment-methods", createPaymentMethod);
app.post("/products", createProduct);
app.post("/carriers", createCarrier);
app.post("/status-deliveries", createStatusDelivery);
app.post("/create-order", createOrder);
app.post("/chatbot", ChainSequence);

app.get("/products", getProducts);
app.get("/users", getUsers);
app.get("/carriers", getCarriersInfo);
app.get("/status-deliveries", getStatusDeliveries);
app.get("/orders", getOrders);
app.get("/payment-methods", getPaymentMethods);
app.get("/all-order-info", getAllOrders);

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
