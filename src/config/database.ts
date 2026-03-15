import mongoose from "mongoose";

let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  const db = await mongoose.connect(process.env.MONGODB_URI!);

  isConnected = db.connections[0].readyState === 1;

  console.log("MongoDB connected");
};

export default connectDB;