import React from "react";
import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";

export default function StatusCard({ userAddress }) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "locks",
    args: [userAddress],
    watch: true,
  });

  if (isLoading) return <p>Loading status...</p>;
  if (!data || data[1] === 0n) return <p>No ETH locked yet.</p>;

  const nominee = data[0];
  const amount = Number(data[1]) / 1e18;
  const timestamp = new Date(Number(data[2]) * 1000).toLocaleString();
  const released = data[3];

  return (
    <div style={{ marginTop: 40 }}>
      <h3>🔍 Lock Status</h3>
      <p>Nominee: {nominee}</p>
      <p>Amount: {amount} ETH</p>
      <p>Locked At: {timestamp}</p>
      <p>Status: {released ? "✅ Released" : "⏳ Active"}</p>
    </div>
  );
}
