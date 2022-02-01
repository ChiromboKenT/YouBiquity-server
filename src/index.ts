import express, { Application, NextFunction, Request, Response } from "express";
import "./db/mongoose";
import cors from "cors";
import { route } from "./routes/user";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.PORT);

const app: Application = express();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/admin", route);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Successfull");
});

app.listen(process.env.PORT, () => {
  console.log("Listening on Port: 3000");
});
