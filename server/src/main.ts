import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { initIOServer } from "./io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
initIOServer(httpServer);

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
