import { Server } from "http";
import { Server as IOServer } from "socket.io";
import registerMatch from "./match";
import registerRoom from "./room";

export const initIOServer = (httpServer: Server) => {
  const io = createIOServer(httpServer);
  io.on("connection", (socket) => {
    console.log("a user connected");

    if (process.env.APP_ENV !== "production") {
      socket.onAny((event, ...rest) => {
        console.log(`received ${event}`, rest);
      });
      socket.onAnyOutgoing((event, ...rest) => {
        console.log(`sent ${event}`, rest);
      });
    }

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    registerRoom(socket, io);
    registerMatch(socket, io);
  });
};

const createIOServer = (httpServer: Server) => {
  const io = new IOServer(httpServer, {
    serveClient: false,
    cors: {
      origin: [/^http:\/\/localhost:\d+/, /^https:\/\/type-match\w*\.vercel\.app$/],
    },
  });
  return io;
};
