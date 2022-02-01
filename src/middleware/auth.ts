import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "../models/models";

export interface UserRequest extends Request {
  user?: IUserDocument;
  token?: string;
}

export const auth = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token!, "thisismynewcourse") as jwt.JwtPayload;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
