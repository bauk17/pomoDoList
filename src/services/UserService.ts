import User from "../Models/MongoUser";
import { hashPassword, verifyPassword } from "../Handlers/handleHash";
import { ObjectAlreadyExistsException } from "../exceptions/ObjectAlreadyExists";
import { MissingFieldError } from "../exceptions/MissingField";
import { ObjectNotFoundException } from "../exceptions/ObjectNotFound";

interface UserCreateProps {
  username: string;
  email: string;
  password: string;
}

interface UserAuthProps {
  username: string;
  password: string;
}

export const CreateAccount = async ({
  username,
  email,
  password,
}: UserCreateProps) => {
  try {
    if (!username) throw new MissingFieldError("username");
    if (!email) throw new MissingFieldError("email");
    if (!password) throw new MissingFieldError("password");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new MissingFieldError("email");
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email === email && existingUser.username === username) {
        throw new ObjectAlreadyExistsException(
          "E-mail and Username already in use",
          400
        );
      } else if (existingUser.email === email) {
        throw new ObjectAlreadyExistsException("E-mail already in use", 400);
      } else if (existingUser.username === username) {
        throw new ObjectAlreadyExistsException("Username already in use", 400);
      }

      throw new ObjectAlreadyExistsException("User already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const NewUser = await User.create({
      username,
      password: hashedPassword,
      email,
      created_at: new Date(),
    });

    return NewUser;
  } catch (err) {
    throw err;
  }
};

export const UserAuthentication = async ({
  username,
  password,
}: UserAuthProps) => {
  try {
    const userExist = await User.findOne({ username });

    if (!userExist) {
      throw new ObjectNotFoundException("User not found", 400);
    }

    const isPasswordCorrect = await verifyPassword(
      password,
      userExist.password
    );

    if (!isPasswordCorrect) {
      throw new ObjectNotFoundException("Incorrect password", 400);
    }

    return {
      username: userExist.username,
      email: userExist.email,
      id: userExist.id,
      created_at: userExist.created_at,
    };
  } catch (err) {
    throw err;
  }
};
