import Task from "../Models/MongoTask";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isUserOwner } from "../Handlers/handleIsUserOwner";
import { increaseUserPoints } from "../services/RewardSystem";

export const newTask = async (req: Request, res: Response) => {
  const { task, description } = req.body;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const decodedToken: any = jwt.decode(req.cookies.token);

    const createTask = await Task.create({
      task,
      description,
      created_at: currentDate,
      userId: decodedToken.id,
    });

    return res.send({ message: "Task created successful!", createTask });
  } catch (err) {
    return res.status(500).send({ message: "Internal server error!", err });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const decodedToken: any = jwt.decode(req.cookies.token);

    const getUserTasks = await Task.find({ userId: decodedToken.id });

    return res.status(200).json({ getUserTasks });
  } catch (err) {
    return res.status(500).send({ e: "Internal server error!", err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  try {
    const findTask: any = await Task.findOne({ _id: taskId });
    const checkIn = isUserOwner(req, findTask.userId.toString());

    if (findTask == undefined) {
      return res.send({ message: "This task doesn't exist on database" });
    }

    if (!checkIn) {
      return res.send({ message: "You are not the owner of this task" });
    }

    await Task.deleteOne({ _id: taskId });

    return res.status(200).send({ message: "Task deleted successful" });
  } catch (err) {
    return res.status(500).send({ message: "Internal server error", err });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  const { task, description } = req.body;

  try {
    const findTask: any = await Task.findOne({ _id: taskId });
    const checkIn = isUserOwner(req, findTask.userId.toString());

    if (!findTask) {
      return res.send({ message: "This task doesn't exist on database" });
    }

    if (!checkIn) {
      return res.send({ message: "You are not the owner of this task" });
    }

    task !== undefined
      ? (findTask.task = task)
      : res.send({ message: "Type a new task" });
    description !== undefined
      ? (findTask.description = description)
      : res.send({ message: " Type a new description" });

    await findTask.save();

    return res.send({ message: "Task updated successful" });
  } catch (err) {
    return res.status(404).send({ message: "Internal server error!", err });
  }
};

export const doneTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  try {
    const findTask = await Task.findOne({ _id: taskId });

    if (!findTask) {
      return res
        .status(404)
        .send({ message: "Task doesn't exist on database!" });
    }

    if (findTask.isDone) {
      return res.send({ message: "Task already marked as done!" });
    }

    const checkIn = isUserOwner(req, findTask.userId.toString());

    if (!checkIn) {
      return res.status(403).send({ message: "You are not the owner" });
    }

    findTask.isDone = true;
    await findTask.save();
    const _points = 20;
    increaseUserPoints(findTask.userId.toString(), 20);
    return res
      .status(200)
      .send({ message: "Task marked as done successfully" });
  } catch (err) {
    console.error("Error marking task as done:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const countUserCompletedTasks = async (req: Request, res: Response) => {
  const decoded: any = jwt.decode(req.cookies.token);

  try {
    const completedTasks = await Task.countDocuments({
      userId: decoded.id,
      isDone: true,
    });

    res.send({ TasksDone: completedTasks });
  } catch (err) {
    console.error(err);
  }
};
