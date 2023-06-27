import { Socket, Server } from "socket.io";
import registerJoin from "./registerJoin";

const registerRoom = (socket: Socket, io: Server) => {
  registerJoin(socket, io);
};

export default registerRoom;
