import { Response, Request } from "express";
import { isUserOwner } from "../Handlers/handleIsUserOwner";
import User from "../Models/MongoUser";

export const increaseUserPoints = async (
  task_owner_id: string,
  pointsToAdd: number
) => {
  try {
    const findUser = await User.findOne({ _id: task_owner_id });

    if (!findUser) {
      return { success: false, message: "User not found" };
    }

    findUser.points += pointsToAdd;
    await findUser.save();

    return { success: true };
  } catch (error) {
    console.error("Error increasing user points:", error);
    return { success: false, message: "Internal server error" };
  }
};
