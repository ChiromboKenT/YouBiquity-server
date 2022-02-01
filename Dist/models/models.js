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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    tel: {
        type: String,
        required: true,
    },
    xml: {
        type: Object,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
            },
        },
    ],
});
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, "thisismynewcourse");
        user.tokens = user.tokens.concat({ token });
        yield user.save();
        return token;
    });
};
userSchema.statics.findByCredentials = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ username });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
});
// Hash the plain text password before saving
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, 8);
        }
        next();
    });
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
