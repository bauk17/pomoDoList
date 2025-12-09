import User from "../Models/MongoUser";
import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../Handlers/handleHash";
import { setCookieToken } from "../services/Cookie";
import jwt from "jsonwebtoken";

export const CreateAccount = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const hashedPassword = await hashPassword(password);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (!username || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(422).send({ message: "Invalid email format!" });
    }

    if (existingUser) {
      if (existingUser.email === email && existingUser.username === username) {
        return res
          .status(409)
          .send({ message: "Email and Username already in use!" });
      } else if (existingUser.email === email) {
        return res.status(409).send({ message: "Email already in use!" });
      } else if (existingUser.username === username) {
        return res.status(409).send({ message: "Username already in use!" });
      }
    }

    const NewUser = await User.create({
      username,
      password: hashedPassword,
      email,
      created_at: currentDate,
    });

    res.status(202).send({ message: "User created successfully!", NewUser });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

export const UserAuthentication = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userExist = await User.findOne({ username });

  if (!userExist) {
    return res.status(400).send({ message: "Username not found!" });
  }

  const isPasswordCorrect = await verifyPassword(password, userExist.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Password incorrect!" });
  }

  try {
    const cookie = setCookieToken(
      res,
      userExist.username,
      userExist.email,
      userExist.id,
      userExist.created_at
    );

    const decodedToken = jwt.decode(cookie);

    res.status(200).send({
      message: "User authenticated successfully",
      decodedToken,
    });
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};
