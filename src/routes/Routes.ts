import express from "express";
import * as UserProfileController from "../Controllers/UserProfile";
import * as MongoUserController from "../Controllers/MongoUserController";
import * as MongoTaskController from "../Controllers/MongoTaskController";

import { verifyTokenMiddleware } from "../services/JWTokenAuthenticate";
import { Request, Response } from "express";

export const Routes = express.Router();

// User Authentication

Routes.get("/", (req: Request, res: Response) => {
  res.send({ message: "It's working" });
});

// Mongo DB
Routes.post("/createAccount", MongoUserController.CreateAccount);

Routes.post("/login", MongoUserController.UserAuthentication);

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

Routes.post("/newTask", verifyTokenMiddleware, MongoTaskController.newTask);
Routes.get("/getTasks", verifyTokenMiddleware, MongoTaskController.getTasks);
Routes.delete(
  "/deleteTask/:taskId",
  verifyTokenMiddleware,
  MongoTaskController.deleteTask
);

Routes.put(
  "/changeTask/:taskId",
  verifyTokenMiddleware,
  MongoTaskController.updateTask
);

Routes.get(
  "/countCompletedTasks",
  verifyTokenMiddleware,
  MongoTaskController.countUserCompletedTasks
);

Routes.put(
  "/doneTask/:taskId",
  verifyTokenMiddleware,
  MongoTaskController.doneTask
);

Routes.get("/check-auth", (req: Request, res: Response) => {
  if (req.cookies.token) {
    res.status(200).send({ message: "Authenticated!" });
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
});
