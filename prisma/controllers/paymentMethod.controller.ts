import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PaymentMethodInput {
  payment_method_id: string;
  payment_method_user_id: number;
  paymet_method_number: number;
  payment_method_name: string;
  payment_method_type: string;
  payment_method_expiration_date: Date;
}

export async function createPaymentMethod(c: any) {
  try {
    const paymentMethodInput = (await c.req.json()) as PaymentMethodInput;
    const { payment_method_user_id, payment_method_id, ...data } =
      paymentMethodInput;

    const paymentMethod = await prisma.payment_method.create({
      data: {
        ...data,
        payment_method_id: String(payment_method_id),
        user: {
          connect: { user_id: payment_method_user_id },
        },
      },
    });

    if (!paymentMethod) {
      return c.json(
        { error: "Cannot create new payment method", ok: false },
        422
      );
    }
    return c.json({ paymentMethod, ok: true }, 201);
  } catch (error) {
    console.error(error); // Imprime el error en la consola del servidor
    return c.json(
      { error: "An error occurred while creating the payment method" },
      500
    );
  }
}

export async function getPaymentMethods(c: any) {
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
}
