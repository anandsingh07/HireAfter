import React, { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { useWalletClient } from "wagmi";

export default function LockFunds() {
  const [nominees, setNominees] = useState("");
  const [amount, setAmount] = useState("");
  const { data: walletClient } = useWalletClient();

  const handleLock = async () => {
    if (!walletClient) return alert("Connect your wallet first!");
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);

    const nomineeList = nominees.split(",").map((n) => n.trim());
    const tx = await contract.lock(nomineeList, {
      value: ethers.parseEther(amount),
    });
    await tx.wait();
    alert("✨ Funds locked successfully!");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          background: "linear-gradient(90deg, #a855f7, #ec4899, #3b82f6)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: "1.5rem",
          textShadow: "0 0 10px rgba(180,100,255,0.5)",
        }}
      >
        🔒 Lock Your ETH Funds
      </h2>

      <input
        type="text"
        placeholder="Nominee addresses (comma separated)"
        value={nominees}
        onChange={(e) => setNominees(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="ETH amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={inputStyle}
      />

      <button onClick={handleLock} style={buttonStyle}>
        🚀 Lock Funds
      </button>

      <p style={{ color: "rgba(220,220,255,0.6)", marginTop: "1rem" }}>
        Your ETH will be locked securely on-chain with your chosen nominees.
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "1rem",
  padding: "0.8rem 1rem",
  borderRadius: "10px",
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(180,100,255,0.3)",
  color: "white",
  fontSize: "1rem",
  outline: "none",
  boxShadow: "0 0 10px rgba(150,0,255,0.3)",
};

const buttonStyle = {
  width: "100%",
  padding: "0.9rem",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 0 20px rgba(150,50,255,0.4)",
  transition: "all 0.3s ease",
};
