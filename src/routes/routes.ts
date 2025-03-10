//swagger routes

import { Router, Request, Response } from "express";
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";
import { registerUser, loginUser } from "../controllers/auth";
import { verifyToken } from "../middleware/authMiddleware";

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Health check
 *     description: Basic route to check if the API is running
 *     responses:
 *       200:
 *         description: Server up and running.
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send({ message: "Welcome to the Movie API!" });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post("/auth/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/auth/login", loginUser);

/**
 * @swagger
 * /movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get all movies
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get("/movies", getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get a single movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie data
 */
router.get("/movies/:id", getMovie);

/**
 * @swagger
 * /movies:
 *   post:
 *     tags:
 *       - Movies
 *     summary: Create a new movie
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Movie"
 *     responses:
 *       200:
 *         description: Movie created successfully
 */
router.post("/movies", verifyToken, createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     tags:
 *       - Movies
 *     summary: Update a movie by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Movie"
 *     responses:
 *       200:
 *         description: Movie updated successfully
 */
router.put("/movies/:id", verifyToken, updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     tags:
 *       - Movies
 *     summary: Delete a movie by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 */
router.delete("/movies/:id", verifyToken, deleteMovie);

export default router;
