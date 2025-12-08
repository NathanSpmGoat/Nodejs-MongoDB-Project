import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connecté avec Mongoose");
}
