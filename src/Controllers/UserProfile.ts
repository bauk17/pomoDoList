import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const getProfile = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  try {
    const decodedToken = jwt.decode(token);

    res.status(200).send({ message: "User infos", decodedToken });
  } catch (error) {
    return res
      .status(403)
      .send({ errorMessage: "Failed to authenticate token" });
  }
};
