import express from "express";
import * as UserProfileController from "../Controllers/UserProfile";

import * as UserController from "../Controllers/UserController";
import * as TaskController from "../Controllers/TaskController";

import * as TaskService from "../services/TaskService";

import { verifyTokenMiddleware } from "../helpers/JWTokenAuthenticate";
import { Request, Response } from "express";

export const Routes = express.Router();

// User Authentication

Routes.get("/", (req: Request, res: Response) => {
  res.send({ message: "It's working" });
});

// Mongo DB
Routes.post("/createAccount", UserController.CreateUser);

Routes.post("/login", UserController.UserAuth);

Routes.get("/test", verifyTokenMiddleware, (req: Request, res: Response) =>
  res.send({ message: "working btw" })
);

Routes.get(
  "/userProfile",
  verifyTokenMiddleware,
  UserProfileController.getProfile
);

Routes.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.status(200).send({ message: "User logged out successfully!" });
});

// Task Management Mongo DB - Everything already working

Routes.post("/newTask", verifyTokenMiddleware, TaskService.newTask);
Routes.get("/getTasks", verifyTokenMiddleware, TaskService.getTasks);
Routes.delete(
  "/deleteTask/:taskId",
  verifyTokenMiddleware,
  TaskController.deleteTask
);

Routes.put(
  "/changeTask/:taskId",
  verifyTokenMiddleware,
  TaskController.updateTask
);

Routes.get(
  "/countCompletedTasks",
  verifyTokenMiddleware,
  TaskService.countUserCompletedTasks
);

Routes.put("/doneTask/:taskId", verifyTokenMiddleware, TaskController.doneTask);

Routes.get("/check-auth", (req: Request, res: Response) => {
  if (req.cookies.token) {
    res.status(200).send({ message: "Authenticated!" });
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
});
