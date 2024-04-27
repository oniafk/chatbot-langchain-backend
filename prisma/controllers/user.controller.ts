import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UserInput {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_password: string;
}

export async function createUser(c: any) {
  const userInput = (await c.req.json()) as UserInput;
  const { user_first_name, user_last_name, user_email, user_password } =
    userInput;
  const newUser = await prisma.user.create({
    data: {
      user_first_name,
      user_last_name,
      user_email,
      user_password,
    },
  });
  if (!newUser) {
    return c.json({ error: "Cannot create new user", ok: false }, 422);
  }
  return c.json({ user: newUser, ok: true }, 201);
}

export async function getUsers(c: any) {
  try {
    const users = await prisma.user.findMany();
    return c.json({ users, ok: true });
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred while fetching the users" }, 500);
  }
}
