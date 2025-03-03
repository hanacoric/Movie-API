import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 */
export async function connectDB(): Promise<void> {
  try {
    const dbHOST = process.env.DB_HOST;

    if (!dbHOST) {
      throw new Error(
        "Database HOST (DB_HOST) not set in environment variables"
      );
    }

    await mongoose.connect(dbHOST, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(" MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the application if DB connection fails
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log(" MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
}
