import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route POST /api/users/link
 * @desc Link wallet address with Twitter handle + nominees
 */
router.post("/link", async (req, res) => {
  try {
    const { walletAddress, twitterHandle, nominees } = req.body;

    if (!walletAddress || !twitterHandle)
      return res.status(400).json({ message: "Missing wallet or handle" });

    let user = await User.findOne({ walletAddress });
    if (user) {
      user.twitterHandle = twitterHandle;
      user.nominees = nominees || [];
    } else {
      user = new User({ walletAddress, twitterHandle, nominees });
    }
    await user.save();

    res.json({ message: "User linked successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route POST /api/users/mockTweet
 * @desc Simulate a tweet (update activity)
 */
router.post("/mockTweet", async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const user = await User.findOne({ walletAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.lastTweetAt = new Date();
    await user.save();

    res.json({ message: "Mock tweet recorded", lastTweetAt: user.lastTweetAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route GET /api/users/:wallet
 * @desc Get user info
 */
router.get("/:wallet", async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.wallet });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
