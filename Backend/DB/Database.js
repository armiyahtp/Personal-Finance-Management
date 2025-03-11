import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/finmanager";
    const { connection } = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected to ${connection.host}`);
  } catch (err) {
    console.error("Database Connection Error:", err);
    process.exit(1);
  }
};