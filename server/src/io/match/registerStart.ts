import { Server, Socket } from "socket.io";
import { matchService } from "../../service";
import { errorHandler } from "../utils";

type MatchStartData = {
  roomId: string;
};

const registerStart = (socket: Socket, io: Server) => {
  socket.on(
    "match:start",
    errorHandler(async ({ roomId }: MatchStartData) => {
      const words = await matchService.getRandomWords();
      const result = await matchService.setMatchWords(roomId, words);
      if (!result.modifiedCount) {
        return;
      }
      io.to(roomId).emit("match:prepare", { words });
      const startTime = Date.now() + 10000;
      const timer = setInterval(async () => {
        const sockets = await io.in(roomId).fetchSockets();
        if (!sockets.length) {
          clearInterval(timer);
          return;
        }
        const now = Date.now();
        const toStart = Math.round((startTime - now) / 1000);
        io.to(roomId).emit("match:to-start", {
          toStart,
        });
        if (toStart <= 0) {
          clearInterval(timer);
          const match = await matchService.startMatch(roomId);
          io.to(roomId).emit("match:start", match);
        }
      }, 1000);
    })
  );
};

export default registerStart;
