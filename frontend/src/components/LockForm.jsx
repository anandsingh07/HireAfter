import React, { useState } from "react";

export default function LockForm({ onLock, txHash }) {
  const [nominee, setNominee] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!window.ethereum) return alert("Please connect your wallet first!");
    onLock(nominee, amount);
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>🔒 Lock ETH</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nominee Address"
          value={nominee}
          onChange={(e) => setNominee(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <input
          type="number"
          step="0.001"
          placeholder="ETH Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <button type="submit">Lock</button>
      </form>

      {txHash && (
        <p>
          ✅ Tx sent:&nbsp;
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Etherscan
          </a>
        </p>
      )}
    </div>
  );
}
