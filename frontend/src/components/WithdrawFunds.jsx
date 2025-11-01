import React, { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { useWalletClient } from "wagmi";

export default function WithdrawFunds() {
  const [lockId, setLockId] = useState("");
  const { data: walletClient } = useWalletClient();

  const handleWithdraw = async () => {
    if (!walletClient) return alert("Connect wallet first!");
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);

    const tx = await contract.withdraw(lockId);
    await tx.wait();
    alert("💎 Withdrawal successful!");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={heading}>💰 Withdraw Funds</h2>
      <input
        type="text"
        placeholder="Enter Lock ID"
        value={lockId}
        onChange={(e) => setLockId(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleWithdraw} style={buttonStyle}>
        🌈 Withdraw
      </button>
    </div>
  );
}

const heading = {
  fontSize: "2rem",
  fontWeight: "700",
  background: "linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)",
  WebkitBackgroundClip: "text",
  color: "transparent",
  marginBottom: "1.5rem",
  textShadow: "0 0 10px rgba(100,255,255,0.4)",
};

const inputStyle = {
  width: "100%",
  marginBottom: "1rem",
  padding: "0.8rem 1rem",
  borderRadius: "10px",
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(120,200,255,0.3)",
  color: "white",
  fontSize: "1rem",
  outline: "none",
  boxShadow: "0 0 10px rgba(0,180,255,0.3)",
};

const buttonStyle = {
  width: "100%",
  padding: "0.9rem",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(90deg, #3b82f6, #22d3ee)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 0 20px rgba(50,200,255,0.4)",
  transition: "all 0.3s ease",
};
