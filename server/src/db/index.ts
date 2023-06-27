import mongoose from "mongoose";
import path from "path";

export const initDb = async () => {
  try {
    mongoose.connection.on("connecting", () => {
      console.log("Connecting to MongoDB...");
    });
    mongoose.connection.on("connected", () => {
      console.log(`Connected to MongoDB ${mongoose.connection.name}`);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected!");
    });
    mongoose.connection.on("error", (err) => {
      console.error(err);
    });
    if (
      mongoose.connection.readyState === mongoose.ConnectionStates.disconnected
    ) {
      await mongoose.connect(process.env.DB_HOST!, {
        tls: true,
        tlsCertificateKeyFile: path.join(__dirname, process.env.DB_CERT!),
        authMechanism: "MONGODB-X509",
        dbName: process.env.DB_NAME,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
