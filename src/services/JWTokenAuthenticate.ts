import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { NextFunction } from "express";

dotenv.config();

const SECRET_KEY = process.env.SECRET_JSON_KEY;

export const generateToken = (
  username: string,
  email: string,
  id: number,
  created_at: Date
) => {
  return jwt.sign({ username, email, id, created_at }, SECRET_KEY as string, {
    expiresIn: "720h",
  });
};

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Token was not provided!" });
  }

  try {
    const verifyToken = jwt.verify(
      token,
      process.env.SECRET_JSON_KEY as string
    );
    next();
  } catch (error) {
    return res.status(403).send({ message: "Failed to authenticate token" });
  }
};
