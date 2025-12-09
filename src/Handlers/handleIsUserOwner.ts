import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isUserOwner = (
  req: Request,
  task_owner_id: string | number | undefined
) => {
  const decodedToken: any = jwt.decode(req.cookies.token);
  const userRequesting = decodedToken.id;

  if (userRequesting !== task_owner_id) {
    return false;
  }

  return true;
};
