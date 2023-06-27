import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { initIOServer } from "./io";
import { initDb } from "./db";

dotenv.config();

const bootstrap = async () => {
  const app = express();
  const httpServer = createServer(app);
  const port = process.env.PORT;

  await initDb();
  initIOServer(httpServer);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

bootstrap();
