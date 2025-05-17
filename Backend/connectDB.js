import mongoose from "mongoose";

const dbName = "mini-amazon";
const dbUsername = "avocado";
const dbPassword = encodeURIComponent("avocado@123");
const dbHost = "cluster0.7mfs2.mongodb.net";
const dbOptions = "retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    const url = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?${dbOptions}`;
    await mongoose.connect(url);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Failed connecting to database");
    console.log(error.message);
    process.exit(1);
  }
};
export default connectDB;
