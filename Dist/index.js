"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./db/mongoose");
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.PORT);
const app = (0, express_1.default)();
const corsOptions = {
    origin: "*",
};
app.use((0, cors_1.default)(corsOptions));
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1/admin", user_1.route);
app.get("/", (req, res) => {
    res.status(200).send("Successfull");
});
app.listen(process.env.PORT, () => {
    console.log("Listening on Port: 3000");
});
