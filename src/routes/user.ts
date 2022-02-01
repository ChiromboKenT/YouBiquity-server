import { Router, Request, Response } from "express";
import User from "../models/models";
import { auth, UserRequest } from "../middleware/auth";

export const route = Router();

route.post("/createUser", async (req: Request, res: Response) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

route.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send("Sorry, cant find that");
  }
});

route.post("/logout", auth, async (req: UserRequest, res: Response) => {
  try {
    req!.user!.tokens = req!.user!.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req!.user!.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

route.post("/logoutAll", auth, async (req: UserRequest, res: Response) => {
  try {
    req!.user!.tokens = [];
    await req!.user!.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
