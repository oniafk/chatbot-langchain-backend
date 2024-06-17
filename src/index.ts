import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import getRelevantDocuments from "./langchain/chatbot/retrievers/matryoshkaRetriever";
const app = new Hono();

const prisma = new PrismaClient();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// app.get("/all-order-info", async (c) => {
//   try {
//     const orders = await prisma.order.findMany({
//       where: {
//         order_user_id: 1,
//       },
//       include: {
//         order_carrier: {
//           select: {
//             carrier_name: true,
//           },
//         },
//         order_status: {
//           select: {
//             status_delivery_name: true,
//           },
//         },
//       },
//     });

//     return c.json({ orders, ok: true });
//   } catch (error) {
//     console.error(error);
//     return c.json({ error: "An error occurred while fetching orders" }, 500);
//   }
// });

// app.post("/chatbot", getRelevantDocuments);

const port = process.env.PORT! || 4000;
console.log(`Running at http://localhost:${port}`);

export default {
  port: port,
  fetch: app.fetch,
};
