import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Invalid Email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  transactions: { type: [mongoose.Schema.Types.ObjectId], ref: "Transaction", default: [] },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully for:", this.email);
    next();
  } catch (err) {
    console.error("Password Hashing Error:", err.message);
    next(err);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log("Password comparison for:", this.email, "Result:", isMatch);
    return isMatch;
  } catch (err) {
    console.error("Password Comparison Error:", err.message);
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
export default User;