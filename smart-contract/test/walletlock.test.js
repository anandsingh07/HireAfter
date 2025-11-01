const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WalletLock", function () {
  const INACTIVITY_PERIOD = 60 * 24 * 60 * 60; // 60 days in seconds

  it("should lock and unlock successfully with valid monitor signature", async function () {
    const [deployer, monitor, user, nominee] = await ethers.getSigners();

    const WalletLock = await ethers.getContractFactory("WalletLock");
    const walletLock = await WalletLock.deploy(monitor.address);
    await walletLock.waitForDeployment();

    const amount = ethers.parseEther("0.01");

    // User locks ETH
    await expect(walletLock.connect(user).lock(nominee.address, { value: amount }))
      .to.emit(walletLock, "Locked");

    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;
    const lastActiveTimestamp = now - INACTIVITY_PERIOD - 10; // sufficiently old

    // Off-chain monitor signs message
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "address", "uint256"],
      [walletLock.target, user.address, lastActiveTimestamp]
    );
    const signature = await monitor.signMessage(ethers.getBytes(messageHash));

    // Unlock
    await expect(walletLock.connect(deployer).unlock(user.address, lastActiveTimestamp, signature))
      .to.emit(walletLock, "Released");

    const lockInfo = await walletLock.locks(user.address);
    expect(lockInfo.amount).to.equal(0n);
    expect(lockInfo.released).to.be.true;
  });

  it("should fail unlock if wrong signer", async function () {
    const [deployer, monitor, user, nominee, badSigner] = await ethers.getSigners();

    const WalletLock = await ethers.getContractFactory("WalletLock");
    const walletLock = await WalletLock.deploy(monitor.address);
    await walletLock.waitForDeployment();

    const amount = ethers.parseEther("0.01");
    await walletLock.connect(user).lock(nominee.address, { value: amount });

    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;
    const lastActiveTimestamp = now - INACTIVITY_PERIOD - 10;

    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "address", "uint256"],
      [walletLock.target, user.address, lastActiveTimestamp]
    );
    const badSig = await badSigner.signMessage(ethers.getBytes(messageHash));

    await expect(
      walletLock.connect(deployer).unlock(user.address, lastActiveTimestamp, badSig)
    ).to.be.revertedWith("Invalid inactivity proof signature");
  });

  it("should fail unlock if inactivity period not reached", async function () {
    const [deployer, monitor, user, nominee] = await ethers.getSigners();

    const WalletLock = await ethers.getContractFactory("WalletLock");
    const walletLock = await WalletLock.deploy(monitor.address);
    await walletLock.waitForDeployment();

    const amount = ethers.parseEther("0.01");
    await walletLock.connect(user).lock(nominee.address, { value: amount });

    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;
    const lastActiveTimestamp = now - 100; // too recent

    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "address", "uint256"],
      [walletLock.target, user.address, lastActiveTimestamp]
    );
    const signature = await monitor.signMessage(ethers.getBytes(messageHash));

    await expect(
      walletLock.connect(deployer).unlock(user.address, lastActiveTimestamp, signature)
    ).to.be.revertedWith("Inactivity period not yet reached");
  });
});
