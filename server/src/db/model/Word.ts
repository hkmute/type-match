import mongoose from "mongoose";
import wordSchema from "../schema/word";

const Word = mongoose.model("Word", wordSchema);

export default Word;
