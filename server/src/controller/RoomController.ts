import { RequestHandler } from "express";

class RoomController {
  constructor() {}

  getActivePlayerCountByRoom: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.io) {
        throw new Error("Socket.io server is not initialized");
      }
      const sockets = await req.io.in(id).fetchSockets();
      res.json({
        success: true,
        data: { count: sockets.length },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default RoomController;
