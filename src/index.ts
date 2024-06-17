import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client";
import matrtyoshkaApp from "./langchain/chatbot/retrievers/matryoshkaRetriever";
const app = new Hono();

const prisma = new PrismaClient();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/all-order-info", async (c) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        order_user_id: 1,
      },
      include: {
        order_carrier: {
          select: {
            carrier_name: true,
          },
        },
        order_status: {
          select: {
            status_delivery_name: true,
          },
        },
      },
    });

    return c.json({ orders, ok: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred while fetching orders" }, 500);
  }
});

app.get("/payment-methods", async (c) => {
  try {
    const paymentMethods = await prisma.payment_method.findMany();
    return c.json({ paymentMethods, ok: true });
  } catch (error) {
    console.error(error);
    return c.json(
      { error: "An error occurred while fetching the payment methods" },
      500
    );
  }
});

app.get("/users", async (c) => {
  try {
    const users = await prisma.user.findMany();
    return c.json({ users, ok: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred while fetching the users" }, 500);
  }
});

app.route("/chatbot", matrtyoshkaApp);

app.use(
  "*",
  cors({
    origin: "http://localhost:3000", // Ajusta el puerto según tu configuración local
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false, // Si necesitas enviar cookies o headers de autenticación
  })
);

const port = process.env.PORT! || 4000;
console.log(`Running at http://localhost:${port}`);

export default {
  port: port,
  fetch: app.fetch,
};
