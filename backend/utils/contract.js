import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const abi = JSON.parse(fs.readFileSync("./abi/WalletLock.json", "utf8"));
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

export default contract;
