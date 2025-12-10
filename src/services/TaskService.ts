import Task from "../Models/MongoTask";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isUserOwner } from "../Handlers/handleIsUserOwner";
import { increaseUserPoints } from "../helpers/RewardSystem";
import { ObjectNotFoundException } from "../exceptions/ObjectNotFound";
import { UnauthorizedException } from "../exceptions/Unauthorized";
import { MissingFieldError } from "../exceptions/MissingField";

interface TaskProps {
  task: string;
  description: string;
  token: string;
}

export const newTask = async ({ task, description, token }: TaskProps) => {
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const decodedToken: any = jwt.decode(token);

    const createTask = await Task.create({
      task,
      description,
      created_at: currentDate,
      userId: decodedToken.id,
    });

    return createTask;
  } catch (err) {
    throw err;
  }
};

export const getTasks = async (token: string) => {
  try {
    const decodedToken: any = jwt.decode(token);

    const getUserTasks = await Task.find({ userId: decodedToken.id });

    if (!getUserTasks)
      throw new ObjectNotFoundException("Task was not found", 400);

    return getUserTasks;
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (token: string, taskId: string) => {
  /* const taskId = req.params.taskId; */

  try {
    const findTask: any = await Task.findOne({ _id: taskId });
    /* const checkIn = isUserOwner(req, findTask.userId.toString()); */

    if (findTask == undefined) {
      throw new ObjectNotFoundException("Task not found", 400);
    }

    /* if (!checkIn) {
      throw new UnauthorizedException("Don`t have enough permission", 401);
    } */

    const deletedTask = await Task.deleteOne({ _id: taskId });

    return deletedTask;
  } catch (err) {
    throw err;
  }
};

export const updateTask = async (
  taskId: string,
  { task, description }: TaskProps
) => {
  try {
    const findTask: any = await Task.findOne({ _id: taskId });
    /* const checkIn = isUserOwner(req, findTask.userId.toString()); */

    if (!findTask) {
      throw new ObjectNotFoundException("Task not found", 400);
    }

    /* if (!checkIn) {
      return res.send({ message: "You are not the owner of this task" });
    } */

    if (!task) throw new MissingFieldError("task");
    if (!description) throw new MissingFieldError("description");

    const savedTask = await findTask.save();

    return savedTask;
  } catch (err) {
    throw err;
  }
};

export const doneTask = async (token: string, taskId: string) => {
  try {
    const findTask = await Task.findOne({ _id: taskId });

    if (!findTask) throw new ObjectNotFoundException("Task not found", 400);

    /* const checkIn = isUserOwner(req, findTask.userId.toString()); */

    /* if (!checkIn) {
      return res.status(403).send({ message: "You are not the owner" });
    } */

    findTask.isDone = true; // maybe do findTask.isDone = !isDone; instead of .isDone = true;
    const taskDone = await findTask.save();
    const _points = 20;
    increaseUserPoints(findTask.userId.toString(), _points);

    return taskDone;
  } catch (err) {
    throw err;
  }
};

export const countUserCompletedTasks = async (token: string) => {
  const decoded: any = jwt.decode(token);

  try {
    const completedTasks = await Task.countDocuments({
      userId: decoded.id,
      isDone: true,
    });

    return completedTasks;
  } catch (err) {
    throw err;
  }
};
