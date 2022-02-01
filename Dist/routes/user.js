"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const models_1 = __importDefault(require("../models/models"));
const auth_1 = require("../middleware/auth");
exports.route = (0, express_1.Router)();
exports.route.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new models_1.default(req.body);
    try {
        yield user.save();
        const token = yield user.generateAuthToken();
        res.status(201).send({ user, token });
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
exports.route.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.default.findByCredentials(req.body.username, req.body.password);
        const token = yield user.generateAuthToken();
        res.send({ user, token });
    }
    catch (e) {
        console.log(e);
        res.status(400).send("Sorry, cant find that");
    }
}));
exports.route.post("/logout", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        yield req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
}));
exports.route.post("/logoutAll", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = [];
        yield req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
}));
