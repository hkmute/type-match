import { Server, Socket } from "socket.io";
import { matchService } from "../../service";
import { errorHandler } from "../utils";

type MatchCompleteData = {
  roomId: string;
  userInput: string;
};

const registerComplete = (socket: Socket, io: Server) => {
  socket.on(
    "match:complete",
    errorHandler(async ({ roomId, userInput }: MatchCompleteData) => {
      const result = await matchService.userCompleteMatch(
        roomId,
        socket.id,
        userInput
      );
      const isAllUserComplete = await matchService.isAllUserComplete(roomId);
      if (isAllUserComplete) {
        const match = await matchService.endMatch(roomId);
        socket.to(roomId).emit("match:finished", match);
        await scheduleRestart(roomId, io);
      }
      //TODO: enforce match finish after limited time

      io.to(roomId).emit("match:update", result);
    })
  );
  const scheduleRestart = async (roomId: string, io: Server) => {
    const restartTime = Date.now() + 10000;
    const timer = setInterval(async () => {
      const sockets = await io.in(roomId).fetchSockets();
      if (!sockets.length) {
        clearInterval(timer);
        return;
      }
      const now = Date.now();
      const toRestart = Math.round((restartTime - now) / 1000);
      io.to(roomId).emit("match:restart", {
        toRestart,
      });
      if (toRestart <= 0) {
        clearInterval(timer);
        const sockets = await io.in(roomId).fetchSockets();
        if (sockets.length && !(await matchService.getActiveMatch(roomId))) {
          const newMatch = await matchService.createMatch(roomId);
          io.to(roomId).emit("match:created", newMatch);
        }
      }
    }, 1000);
  };
};

export default registerComplete;
