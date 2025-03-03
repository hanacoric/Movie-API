import { Router } from "express";
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";

const router = Router();

// Define routes for CRUD operations
router.get("/", getMovies); // Get all movies
router.get("/:id", getMovie); // Get a single movie
router.post("/", createMovie); // Add a new movie
router.put("/:id", updateMovie); // Update a movie
router.delete("/:id", deleteMovie); // Delete a movie

export default router;
