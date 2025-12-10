import Task from "../Models/MongoTask";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isUserOwner } from "../Handlers/handleIsUserOwner";
import { increaseUserPoints } from "../helpers/RewardSystem";

export const newTask = async (req: Request, res: Response) => {};

export const getTasks = async (req: Request, res: Response) => {};

export const deleteTask = async (req: Request, res: Response) => {};

export const updateTask = async (req: Request, res: Response) => {};

export const doneTask = async (req: Request, res: Response) => {};

export const countUserCompletedTasks = async (
  req: Request,
  res: Response
) => {};
