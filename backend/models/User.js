import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  twitterHandle: { type: String, required: true },
  lastTweetAt: { type: Date, default: Date.now },
  nominees: [{ type: String }],
});

export default mongoose.model("User", userSchema);
