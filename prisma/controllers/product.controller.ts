import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface productInput {
  product_name: string;
  product_price: number;
}

export async function createProduct(c: any) {
  const productInput = (await c.req.json()) as productInput;
  const { product_name, product_price } = productInput;
  const newProduct = await prisma.product.create({
    data: {
      product_name,
      product_price,
    },
  });
  if (!newProduct) {
    return c.json({ error: "Cannot create new product", ok: false }, 422);
  }
  return c.json({ product: newProduct, ok: true }, 201);
}
