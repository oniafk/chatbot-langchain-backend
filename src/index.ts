import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
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

import getRelevantDocuments from "./langchain/chatbot/retrievers/matryoshkaRetriever";
const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/users", createUser);
app.post("/payment-methods", createPaymentMethod);
app.post("/products", createProduct);
app.post("/carriers", createCarrier);
app.post("/status-deliveries", createStatusDelivery);
app.post("/create-order", createOrder);
app.post("/chatbot", getRelevantDocuments);

app.get("/products", getProducts);
app.get("/users", getUsers);
app.get("/carriers", getCarriersInfo);
app.get("/status-deliveries", getStatusDeliveries);
app.get("/orders", getOrders);
app.get("/payment-methods", getPaymentMethods);
app.get("/all-order-info", getAllOrders);

const port = process.env.PORT! || 4000;
console.log(`Running at http://localhost:${port}`);
// const port = 3001;
// console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};

serve({
  fetch: app.fetch,
  port: 4000,
});
