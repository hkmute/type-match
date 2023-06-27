import mongoose from "mongoose";
import matchSchema from "../schema/match";

const Match = mongoose.model("Match", matchSchema);

export default Match;
