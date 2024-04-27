import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface OrderInput {
  order_id: number;
  order_product_id: number;
  order_quantity: number;
  order_total: number;
  order_user_id: number;
  order_carrier_id: number;
  order_address: string;
  order_city: string;
  order_country: string;
  order_postal_code: string;
  order_tracking_number: string;
  order_status_id: number;
  order_date: Date;
  order_shipment_date: Date;
}

export async function createOrder(c: any) {
  try {
    const orderInput = (await c.req.json()) as OrderInput;
    const {
      order_user_id,
      order_product_id,
      order_carrier_id,
      order_status_id,
      ...data
    } = orderInput;

    const order = await prisma.order.create({
      data: {
        ...data,
        user: {
          connect: { user_id: order_user_id },
        },
        product: {
          connect: { product_id: order_product_id },
        },
        order_carrier: {
          connect: { carrier_id: order_carrier_id },
        },
        order_status: {
          connect: { status_delivery_id: order_status_id },
        },
      },
    });

    if (!order) {
      return c.json({ error: "Cannot create new order", ok: false }, 422);
    }
    return c.json({ order, ok: true }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred while creating the order" }, 500);
  }
}

export async function getOrders(c: any) {
  try {
    const orders = await prisma.order.findMany({
      select: {
        order_total: true,
        order_carrier: true,
        order_tracking_number: true,
        order_status: true,
      },
    });
    return c.json({ orders, ok: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred while fetching orders" }, 500);
  }
}

export async function getAllOrders(c: any) {
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
}
