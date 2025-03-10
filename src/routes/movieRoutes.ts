import { Router } from "express";
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";
import { registerUser } from "../controllers/auth";
import { loginUser } from "../controllers/auth";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Define routes for CRUD operations
router.get("/", getMovies); // Get all movies
router.get("/:id", getMovie); // Get a single movie
router.post("/", verifyToken, createMovie); // Add a new movie
router.put("/:id", verifyToken, updateMovie); // Update a movie
router.delete("/:id", verifyToken, deleteMovie); // Delete a movie

//auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
