import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbconnect = mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("MongoDB is connected!"))
  .catch((err) => {
    console.log(err);
  });
export default dbconnect;
