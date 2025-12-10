import { Request, Response } from "express";
import * as UserService from "../services/UserService";
import { UserDto } from "../dto/UserDto";
import { ObjectNotFoundException } from "../exceptions/ObjectNotFound";
import { setCookieToken } from "../helpers/Cookie";
import jwt from "jsonwebtoken";
export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const User = await UserService.CreateAccount({ username, password, email });

    res.status(201).send({
      message: "User created successfully",
      user: new UserDto(User.username, User.email),
    });
  } catch (err: any) {
    res.status(err.status || 400).json({
      error: err.name,
      message: err.message,
    });
  }
};

export const UserAuth = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const User = await UserService.UserAuthentication({ username, password });

    const token = setCookieToken(
      res,
      User.username,
      User.email,
      User.id,
      User.created_at
    );

    const UserAuthenticated = new UserDto(User.username, User.email);

    return res
      .status(200)
      .json({ message: "User Authenticated", UserAuthenticated });
  } catch (err: any) {
    if (err instanceof ObjectNotFoundException) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(err.status || 500).json({
      error: err.name,
      message: err.message,
    });
  }
};
