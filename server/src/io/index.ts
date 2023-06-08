import { Server } from "http";
import { Server as IOServer } from "socket.io";

export const initIOServer = (httpServer: Server) => {
  const io = createIOServer(httpServer);
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

const createIOServer = (httpServer: Server) => {
  const io = new IOServer(httpServer, {
    serveClient: false,
    cors: {
      origin: [/^http:\/\/localhost:\d+/],
    },
  });
  return io;
};
