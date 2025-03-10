import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

// import models
import Movie from "../models/movie";
import { UserModel } from "../models/userModel";
import { connectDB, disconnectDB } from "../config/db";

// seed function to seed data
export async function seedDatabase() {
  try {
    await connectDB();
    await clearDatabase(); // Delete existing data
    await generateData(); // Seed new data

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await disconnectDB();
  }
}

//delete existing data
export async function clearDatabase() {
  await Movie.deleteMany();
  await UserModel.deleteMany();
  console.log("Cleared existing data");
}

//generate and insert fake users and movies
export async function generateData() {
  // hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("testpassword", salt);

  // create three test users
  const user1 = new UserModel({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: passwordHash,
  });

  const user2 = new UserModel({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: passwordHash,
  });
  const user3 = new UserModel({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: passwordHash,
  });

  await user1.save();
  await user2.save();
  await user3.save();

  // create 10 fake movies
  for (let i = 0; i < 10; i++) {
    await new Movie({
      title: faker.lorem.words(3),
      year: faker.number.int({ min: 1950, max: 2024 }),
      genre: faker.helpers.arrayElement([
        "Postmodernist Films",
        "Comedy",
        "Drama",
        "Thriller",
        "Crime",
        "Romance",
      ]),
      actors: [faker.person.fullName(), faker.person.fullName()],
      director: faker.person.fullName(),
    }).save();
  }

  console.log("Seeded movies successfully!");
}

seedDatabase();
