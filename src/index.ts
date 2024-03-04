import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { db } from "./langchain/database/sql/index";

const app = new Hono();

app.get("/", (c) => {
  db();
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
