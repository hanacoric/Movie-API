import { setupSwagger } from "./config/swagger";
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import movieRoutes from "./routes/movieRoutes";
import authRoutes from "./routes/movieRoutes";
import routes from "./routes/routes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

/**
 * Middleware setup
 */

// Enable CORS for cross-origin requests

function setupCors() {
  app.use(
    cors({
      origin: "*", //allow all
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: [
        "auth-token",
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
      ],
      credentials: true,
    })
  );

  //handle preflight requests
  app.options("*", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "auth-token, Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.send(200);
  });
}

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

app.use("/api", routes);

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

// Register auth routes
app.use("/api/auth", authRoutes);

/**
 * Start Server
 */
export async function startServer() {
  try {
    setupSwagger(app); // Setup Swagger
    setupCors();
    await connectDB(); // Connect to MongoDB

    const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    const HOST = process.env.HOST || "http://localhost";

    app.listen(PORT, () => {
      console.log(` Server is running at ${HOST}:${PORT}`);
      console.log(`Swagger docs available at ${HOST}:${PORT}/api/docs`); //to show the link in the terminal
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
}

//  Start the server
startServer();
