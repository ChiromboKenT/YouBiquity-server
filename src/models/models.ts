import mongoose, { Schema, Document, Model, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface Tokens {
  token: string;
}
interface IUser {
  username: string;
  fullname: string;
  email: string;
  password: string;
  tel: string;
  xml: any;
  role: string;
  tokens: Tokens[];
}

export interface IUserDocument extends IUser, Document {
  generateAuthToken: () => Promise<void>;
}
interface IUserModel extends Model<IUserDocument> {
  findByCredentials: (
    username: string,
    password: string
  ) => Promise<IUserDocument>;
}
const userSchema: Schema<IUserDocument> = new Schema({
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
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model<IUserDocument, IUserModel>("User", userSchema);

export default User;
