import mongoose, { Document } from "mongoose"; // Import mongoose and document that ensures strict typing when working with MongoDB documents

// Describes the properties of a movie
interface IMovie extends Document {
  title: string;
  year: number;
  genre: string;
  actors: string[];
  director: string;
}

// Define the movie schema
const movieSchema = new mongoose.Schema<IMovie>({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  actors: { type: [String], required: true },
  director: { type: String, required: true },
});

// Create a model from the schema
const Movie = mongoose.model<IMovie>("Movie", movieSchema);
export default Movie;
