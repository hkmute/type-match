import Match from "../db/model/Match";
import Word from "../db/model/Word";
import { WordType } from "../db/schema/word";

class MatchService {
  constructor() {}

  createMatch = async (
    roomId: string,
    user?: {
      socketId: string;
      name: string;
      joinAt: Date;
    }
  ) => {
    const newMatch = await Match.create({
      roomId,
      users: user ? [user] : undefined,
    });
    return newMatch;
  };

  getMatchById = async (matchId: string) => {
    const match = await Match.findById(matchId);
    return match;
  };

  getActiveMatch = async (roomId: string) => {
    const activeMatch = await Match.find({
      roomId,
      status: {
        $in: ["P", "S"],
      },
    })
      .sort({ updatedAt: -1 })
      .limit(1);

    return activeMatch[0];
  };

  getRandomWords = async (size = 10) => {
    const result = await Word.aggregate<WordType>([{ $sample: { size } }]);
    return result.map((word) => word.value);
  };

  setMatchWords = async (roomId: string, words: string[]) => {
    const result = await Match.updateMany(
      {
        roomId,
        status: "P",
      },
      {
        matchWords: words,
      }
    );
    return result;
  };

  addUserToMatch = async (
    user: { socketId: string; name: string; joinAt: Date },
    matchId: string
  ) => {
    const { socketId, name, joinAt } = user;
    const result = await Match.findOneAndUpdate(
      { _id: matchId, "users.socketId": { $ne: socketId } },
      {
        $addToSet: {
          users: { socketId, name, joinAt },
        },
        $push: {
          users: {
            $each: [],
            $sort: { joinAt: 1 },
          }
        }
      },
      { new: true }
    );
    return result;
  };

  startMatch = async (roomId: string) => {
    const result = await Match.findOneAndUpdate(
      {
        roomId,
        status: "P",
      },
      {
        status: "S",
        startTime: Date.now(),
      },
      { new: true }
    );
    return result;
  };

  userCompleteMatch = async (
    roomId: string,
    socketId: string,
    userInput: string
  ) => {
    const result = await Match.findOneAndUpdate(
      {
        roomId,
        status: "S",
        "users.socketId": socketId,
      },
      {
        $set: {
          "users.$.userInput": userInput,
          "users.$.completeTime": Date.now(),
        },
      },
      { new: true }
    );
    return result;
  };

  isAllUserComplete = async (roomId: string) => {
    const result = await Match.findOne({
      roomId,
      status: "S",
      users: {
        $elemMatch: {
          completeTime: {
            $exists: false,
          },
        },
      },
    });
    return result === null;
  };

  endMatch = async (roomId: string) => {
    const result = await Match.findOneAndUpdate(
      {
        roomId,
        status: "S",
      },
      {
        status: "C",
      },
      { new: true }
    );
    return result;
  };

  removeUserFromMatch = async (userId: string) => {
    const result = await Match.updateMany(
      {
        status: {
          $nin: "C",
        },
      },
      { $pull: { users: { socketId: userId } } }
    );
    return result;
  };
}

export default MatchService;
