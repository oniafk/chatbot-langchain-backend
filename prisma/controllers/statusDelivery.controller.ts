import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface statusDeliveryInput {
  status_delivery_name: string;
}

export async function createStatusDelivery(c: any) {
  const statusDeliveryInput = (await c.req.json()) as statusDeliveryInput;
  const { status_delivery_name } = statusDeliveryInput;
  const newStatusDelivery = await prisma.status_delivery.create({
    data: {
      status_delivery_name,
    },
  });
  if (!newStatusDelivery) {
    return c.json(
      { error: "Cannot create new status delivery", ok: false },
      422
    );
  }
  return c.json({ status_delivery: newStatusDelivery, ok: true }, 201);
}

export async function getStatusDeliveries(c: any) {
  try {
    const statusDeliveries = await prisma.status_delivery.findMany({
      select: {
        status_delivery_id: true,
        status_delivery_name: true,
      },
    });
    return c.json({ statusDeliveries, ok: true });
  } catch (error) {
    console.error(error);
    return c.json(
      { error: "An error occurred while fetching the status deliveries" },
      500
    );
  }
}
