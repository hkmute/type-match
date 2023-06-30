import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { initIOServer } from "./io";
import { initDb } from "./db";
import router from "./routes";

dotenv.config();

const bootstrap = async () => {
  const app = express();
  const httpServer = createServer(app);
  const port = process.env.PORT;

  await initDb();
  const io = initIOServer(httpServer);

  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  app.use(router);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

bootstrap();
