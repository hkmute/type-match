import { Schema } from "mongoose";

export type WordType = {
  value: string;
};

const wordSchema = new Schema<WordType>({
  value: {
    type: String,
    required: true,
    unique: true,
  },
});

export default wordSchema;
