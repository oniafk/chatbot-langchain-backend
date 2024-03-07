import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { db } from "./langchain/database/sql/index";
import { agentLLM } from "./langchain/database/sql/agent";
import { createUser } from "../prisma/controllers/user.controller";

const app = new Hono();

app.get("/", (c) => {
  db();
  agentLLM();
  return c.text("Hello Hono!");
});

app.post("/users", createUser);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
