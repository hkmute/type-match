import { Server, Socket } from "socket.io";
import registerStart from "./registerStart";
import registerComplete from "./registerComplete";

const registerMatch = (socket: Socket, io: Server) => {
  registerStart(socket, io);
  registerComplete(socket, io);
};

export default registerMatch;
