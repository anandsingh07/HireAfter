const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  // 👇 Replace with your actual monitor wallet address
  const monitorAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  const WalletLock = await ethers.getContractFactory("WalletLock");
  const walletLock = await WalletLock.deploy(monitorAddress);
  await walletLock.waitForDeployment();

  console.log("✅ WalletLock deployed to:", walletLock.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
