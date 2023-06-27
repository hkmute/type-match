import { Schema } from "mongoose";

const matchUser = new Schema(
  {
    socketId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    userInput: {
      type: String,
    },
    completeTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const matchSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["P", "S", "C"],
      required: true,
      default: "P",
    },
    roomId: {
      type: String,
      required: true,
    },
    matchWords: {
      type: [String],
    },
    startTime: {
      type: Date,
    },
    users: {
      type: [matchUser],
      default: [],
    },
  },
  { timestamps: true }
);

export default matchSchema;
