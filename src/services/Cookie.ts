import { generateToken } from "./JWTokenAuthenticate";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const setCookieToken = (
  res: Response,
  username: string,
  email: string,
  id: number,
  created_at: Date
) => {
  const token = generateToken(username, email, id, created_at);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  return token;
};
