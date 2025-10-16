import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbName = process.env.dbName;
const dbUsername = process.env.dbUsername;
const dbPassword = process.env.dbPassword;
const dbHost = process.env.dbHost;
const dbOptions = process.env.dbOptions;
const connectDB = async () => {
  if (!dbName || !dbUsername || !dbPassword || !dbHost) {
    console.error("Missing MongoDB environment variables");
    process.exit(1);
  }

  try {
    const url = `mongodb+srv://${dbUsername}:${encodeURIComponent(
      dbPassword
    )}@${dbHost}/${dbName}?${dbOptions}`;
    await mongoose.connect(url);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Failed connecting to database");
    console.log(error.message);
    process.exit(1);
  }
};
export default connectDB;
