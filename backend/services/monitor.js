import cron from "node-cron";
import User from "../models/User.js";
import contract from "../utils/contract.js";
import connectDB from "../db.js";
import dotenv from "dotenv";

dotenv.config();
await connectDB();

console.log("🕒 WalletLock monitor running...");

const INACTIVITY_PERIOD = 60 * 24 * 60 * 60 * 1000; // 60 days in ms

// Runs every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("🔍 Checking inactive users...");

  const users = await User.find();
  const now = Date.now();

  for (const user of users) {
    if (now - new Date(user.lastTweetAt).getTime() > INACTIVITY_PERIOD) {
      try {
        console.log(`⚠️ Inactive: ${user.walletAddress}, triggering autoRelease...`);
        const tx = await contract.autoRelease(user.walletAddress);
        await tx.wait();
        console.log(`✅ Released for ${user.walletAddress}`);
      } catch (err) {
        console.error(`❌ Error releasing ${user.walletAddress}:`, err.message);
      }
    }
  }
});
