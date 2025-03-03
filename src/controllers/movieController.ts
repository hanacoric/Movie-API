import { Request, Response, NextFunction } from "express";
import Movie from "../models/movie"; // Import Movie model

// Create a new movie
export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, year, genre, actors, director } = req.body;
    const newMovie = new Movie({ title, year, genre, actors, director });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie); // Return the created movie
  } catch (error) {
    console.error("Error in createMovie:", error); // Log the error
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get all movies
export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const movies = await Movie.find(); // get all movies from the database
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// Get a single movie
export const getMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const movie = await Movie.findById(req.params.id); // get a single movie by id
    if (!movie) {
      res.status(404).json({ message: "Movie not found" }); // return a 404 error if movie is not found
      return;
    }
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

// Update a movie
export const updateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ); // Finds the movie by ID and updates it with new data from req.body
    if (!updatedMovie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    res.status(200).json(updatedMovie);
  } catch (error) {
    next(error);
  }
};

// Delete a movie
export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    next(error);
  }
};
