import React, { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { useWalletClient } from "wagmi";

export default function WithdrawFunds() {
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!walletClient) return alert("🔗 Connect your wallet first!");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = await getContract(signer);

      const tx = await contract.withdraw(); // no lockId required
      await tx.wait();
      alert("💎 Withdrawal successful!");
    } catch (err) {
      console.error(err);
      alert("⚠️ Transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2 style={heading}>💰 Withdraw Funds</h2>

      <button
        onClick={handleWithdraw}
        style={{
          ...buttonStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? "⏳ Processing..." : "🌈 Withdraw"}
      </button>

      <p style={note}>
        Instantly withdraw all available funds to your connected wallet.
      </p>
    </div>
  );
}

const container = {
  textAlign: "center",
  background: "linear-gradient(135deg, rgba(0,50,50,0.4), rgba(10,10,30,0.7))",
  padding: "2rem",
  borderRadius: "20px",
  border: "1px solid rgba(100,255,255,0.2)",
  boxShadow: "0 0 25px rgba(0,200,255,0.2), inset 0 0 20px rgba(0,150,255,0.2)",
  backdropFilter: "blur(14px)",
  animation: "fadeIn 1.2s ease-in-out",
};

const heading = {
  fontSize: "2rem",
  fontWeight: "700",
  background: "linear-gradient(90deg, #22d3ee, #a855f7, #ec4899)",
  WebkitBackgroundClip: "text",
  color: "transparent",
  marginBottom: "1.5rem",
  textShadow: "0 0 10px rgba(100,255,255,0.4)",
};

const buttonStyle = {
  width: "100%",
  padding: "1rem",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(90deg, #3b82f6, #22d3ee)",
  color: "white",
  fontWeight: "600",
  fontSize: "1rem",
  boxShadow: "0 0 20px rgba(50,200,255,0.4)",
  transition: "all 0.3s ease",
};

const note = {
  fontSize: "0.85rem",
  color: "rgba(200,200,255,0.7)",
  marginTop: "1rem",
  fontStyle: "italic",
};

// Add smooth entry animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
