import Task from "../Models/MongoTask";
import { Request, Response } from "express";
import * as TaskServices from "../services/TaskService";
import jwt from "jsonwebtoken";
import { isUserOwner } from "../Handlers/handleIsUserOwner";

import { UnauthorizedException } from "../exceptions/Unauthorized";

export const newTask = async (req: Request, res: Response) => {
  try {
    const { task, description } = req.body;
    const token = req.cookies.token;
    const NewTask = await TaskServices.newTask({ task, description, token });

    res.status(201).json({ message: "Task created successfully", NewTask });
  } catch (error: any) {
    res
      .status(error.status || 400)
      .send({ error: error.name, message: error.message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const Task = TaskServices.getTasks(req.cookies.token);

    res.status(200).send(Task);
  } catch (error: any) {
    res
      .status(error.status || 400)
      .send({ error: error.name, message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const FindTask = await Task.findOne({ _id: req.params.taskId });
    const checkIn = isUserOwner(req, FindTask?.userId.toString());
    if (!checkIn)
      return res
        .status(401)
        .send({ message: "Don't have enough permission to delete" });
    const deletedTask = await TaskServices.deleteTask(req.params.taskId);

    res.status(200).send({ message: "Task deleted successfully", deletedTask });
  } catch (error: any) {
    res
      .status(error.status || 400)
      .send({ error: error.name, message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { task, description } = req.body;

    const FindTask = await Task.findOne({ _id: req.params.taskId });
    const checkIn = isUserOwner(req, FindTask?.userId.toString());
    if (!checkIn)
      throw new UnauthorizedException("Don`t have enough permission", 401);

    const updatingTask = await TaskServices.updateTask(
      req.params.taskId,
      task,
      description
    );

    res
      .status(201)
      .send({ message: "Task updated successfully", updatingTask });
  } catch (error: any) {
    res
      .status(error.status || 400)
      .send({ error: error.name, message: error.message });
  }
};

export const doneTask = async (req: Request, res: Response) => {
  try {
    const FindTask = await Task.findOne({ _id: req.params.taskId });
    const checkIn = isUserOwner(req, FindTask?.userId.toString());
    if (!checkIn)
      throw new UnauthorizedException("Don`t have enough permission", 401);

    const doneTask = TaskServices.doneTask(req.params.taskId);

    res.status(201).send({ message: "Task done successfully", doneTask });
  } catch (error: any) {
    res
      .status(error.status || 400)
      .send({ error: error.name, message: error.message });
  }
};

export const countUserCompletedTasks = async (
  req: Request,
  res: Response
) => {};
