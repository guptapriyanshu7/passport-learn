import mongoose from "mongoose";
import mnLocal from "passport-local-mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: "String",
    trim: true,
    unique: true,
  },
  password: {
    type: "String",
    trim: true,
  },
});
userSchema.plugin(mnLocal);
export default mongoose.model("User", userSchema);
