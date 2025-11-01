import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./config";
import LockForm from "./components/LockForm";
import StatusCard from "./components/StatusCard";

export default function App() {
  const { address, isConnected } = useAccount();
  const [txHash, setTxHash] = useState(null);

  const { writeContractAsync } = useWriteContract();

  const handleLock = async (nominee, ethAmount) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "lock",
        args: [nominee],
        value: parseEther(ethAmount),
      });
      setTxHash(tx);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>🔒 Wallet Lock MVP</h1>
      <ConnectButton />
      {isConnected && (
        <>
          <LockForm onLock={handleLock} txHash={txHash} />
          <StatusCard userAddress={address} />
        </>
      )}
    </div>
  );
}
