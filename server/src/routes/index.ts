import express from "express";
import { roomController } from "../controller";

const router = express.Router();

router.get("/room/:id/player-count", roomController.getActivePlayerCountByRoom);

export default router;
