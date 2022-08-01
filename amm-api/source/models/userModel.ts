import mongoose, { Schema } from "mongoose";
import userInterface from "../interfaces/userInterface";

const userSchema: Schema = new Schema(
  {
    username: { type: String, require: true, unique: true, minlength: 6, maxlength: 22 },
    password: { type: String, require: true, minlength: 6, maxlength: 22},
    email: { type: String, require: true },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

export default mongoose.model<userInterface>("Users", userSchema);
