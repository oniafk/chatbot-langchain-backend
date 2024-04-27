import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface carrierInput {
  carrier_name: string;
  carrier_phone: string;
  carrier_email: string;
}

export async function createCarrier(c: any) {
  const carrierInput = (await c.req.json()) as carrierInput;
  const { carrier_name, carrier_phone, carrier_email } = carrierInput;
  const newCarrier = await prisma.carrier.create({
    data: {
      carrier_name,
      carrier_phone,
      carrier_email,
    },
  });
  if (!newCarrier) {
    return c.json({ error: "Cannot create new carrier", ok: false }, 422);
  }
  return c.json({ carrier: newCarrier, ok: true }, 201);
}

export async function getCarriersInfo(c: any) {
  const carrier = await prisma.carrier.findMany({
    select: {
      carrier_name: true,
      carrier_phone: true,
      carrier_email: true,
    },
  });
  if (!carrier) {
    return c.json({ error: "Cannot get products", ok: false }, 422);
  }
  return c.json({ carrier, ok: true }, 200);
}
