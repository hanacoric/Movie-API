import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import movieRoutes from "./routes/movieRoutes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

/**
 * Middleware setup
 */

// Enable CORS for cross-origin requests
app.use(cors());

// Use JSON body parser
app.use(express.json());

// Custom middleware to log requests
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

/**
 * API Routes
 */
app.use("/api/movies", movieRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running! Use /api/movies to access the Movie API.");
});

/**
 * Error Handling Middleware
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

/**
 * Start Server
 */
export async function startServer() {
  try {
    await connectDB(); // Connect to MongoDB

    const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    const HOST = process.env.HOST || "http://localhost";

    app.listen(PORT, () => {
      console.log(` Server is running at ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
}

//  Start the server
startServer();
