import { Server, Socket } from "socket.io";
import { matchService } from "../../service";
import { errorHandler } from "../utils";

type RoomJoinData = {
  roomId: string;
  name: string;
};

const registerJoin = (socket: Socket, io: Server) => {
  socket.on(
    "room:join",
    errorHandler(async ({ roomId, name }: RoomJoinData) => {
      if (!roomId) {
        return;
      }

      socket.data.name = name;
      socket.data.roomId = roomId;
      if (!socket.data.joinAt) {
        socket.data.joinAt = new Date();
      }

      const match = await matchService.getActiveMatch(roomId);
      if (!match && (await io.in(roomId).fetchSockets()).length === 0) {
        const newMatch = await matchService.createMatch(roomId, {
          socketId: socket.id,
          name,
          joinAt: socket.data.joinAt,
        });
        socket.join(roomId);
        socket.emit("room:joined", newMatch);
        socket.to(roomId).emit("match:update", newMatch);
        return;
      }

      if (match.status === "P") {
        console.log("add user to match", match.id, socket.id, name);
        const joinedMatch = await matchService.addUserToMatch(
          { socketId: socket.id, name, joinAt: socket.data.joinAt },
          match.id
        );
        socket.join(roomId);
        socket.emit("room:joined", joinedMatch);
        socket.to(roomId).emit("match:update", joinedMatch);
        return;
      }

      socket.join(roomId);
      socket.emit("room:joined", match);
      socket.to(roomId).emit("match:update", match);
    })
  );

  socket.on(
    "disconnect",
    errorHandler(async () => {
      await matchService.removeUserFromMatch(socket.id);
      const sockets = await io.in(socket.data.roomId).fetchSockets();
      if (!sockets.length) {
        await matchService.endMatch(socket.data.roomId);
      } else {
        const match = await matchService.getActiveMatch(socket.data.roomId);
        io.to(socket.data.roomId).emit("match:update", match);
      }
    })
  );
};

export default registerJoin;
