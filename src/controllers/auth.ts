//import
import Joi, { ValidationResult } from "joi";
import { User } from "../interfaces/user";
import { UserModel } from "../models/userModel";
import { connectDB } from "../config/db";
import { disconnectDB } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//registers a new user

export async function registerUser(req: any, res: any) {
  try {
    //validate user input
    const { error } = ValidateRegistration(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    await connectDB();

    //check if email exists
    const emailExists = await UserModel.findOne({ email: req.body.email });

    if (emailExists) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    //check if username exists
    const usernameExists = await UserModel.findOne({
      username: req.body.username,
    });

    if (usernameExists) {
      res.status(400).json({ error: "Username already exists." });
      return;
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.status(200).json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(500).send({ "Error registering the user. Error:": error });
  } finally {
    await disconnectDB();
  }
}

//validate user registration

export function ValidateRegistration(registerData: User): ValidationResult {
  const registerSchema = Joi.object({
    username: Joi.string().trim().min(3).max(200).required().messages({
      "string.empty": "Username is required",
      "string.min": "Username should have a minimum length of 3 characters",
      "string.max": "Username should have a maximum length of 200 characters",
    }),
    email: Joi.string().trim().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
    password: Joi.string().min(6).max(200).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password should have a minimum length of 6 characters",
      "string.max": "Password should have a maximum length of 200 characters",
    }),
  });

  return registerSchema.validate(registerData);
}
//login a user
export async function loginUser(req: any, res: any) {
  try {
    //validate user input
    const { error } = ValidateLogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    await connectDB();

    //find user by username
    const user = await UserModel.findOne({ username: req.body.username });

    //check if user exists
    if (!user) {
      return res
        .status(400)
        .json({ error: "Username or password is incorrect." });
    }

    //check if user is locked out due to too many failed login attempts
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res
        .status(400)
        .json({ error: "Too many failed login attempts. Try again later." });
    }

    //create auth token, compare entered password with the stored hashed password
    const IsPasswordValid: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!IsPasswordValid) {
      //how many failed login attemps
      user.failedLoginAttempts += 1;
      //lock user out if they have failed login attempts
      if (user.failedLoginAttempts >= 5) {
        //lock user for 5 minutes
        user.lockUntil = Date.now() + 5 * 60 * 1000;
      }

      await user.save();
      return res
        .status(400)
        .json({ error: "Username or password is incorrect." });
    }

    //reset failed login attempts on a successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    //generate jwt token for authentication and return it
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .header("Authorization", token) // ✅ Return token in headers
      .json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send("Error logging in user. Error: " + error);
  } finally {
    await disconnectDB();
  }
}
//validate user login

export function ValidateLogin(loginData: User): ValidationResult {
  const loginSchema = Joi.object({
    username: Joi.string().trim().min(3).max(200).required().messages({
      "string.empty": "Username is required",
      "string.min": "Username should have a minimum length of 3 characters",
      "string.max": "Username should have a maximum length of 200 characters",
    }),
    password: Joi.string().trim().min(6).max(200).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password should have a minimum length of 6 characters",
      "string.max": "Password should have a maximum length of 200 characters",
    }),
  });

  return loginSchema.validate(loginData);
}
