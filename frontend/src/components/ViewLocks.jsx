import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";
import { useWalletClient } from "wagmi";

export default function ViewLocks() {
  const [locks, setLocks] = useState([]);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const loadLocks = async () => {
      if (!walletClient) return;
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = await getContract(signer);
      const address = await signer.getAddress();

      const result = await contract.getLocks(address);
      const sorted = [...result].reverse();
      setLocks(sorted);
    };
    loadLocks();
  }, [walletClient]);

  return (
    <div
      className="p-10 rounded-3xl text-white mx-auto shadow-[0_0_40px_rgba(168,85,247,0.4)] backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(35,10,70,0.9), rgba(10,0,30,0.95))",
        border: "1px solid rgba(180,100,255,0.4)",
        boxShadow:
          "0 0 45px rgba(180,80,255,0.3), inset 0 0 35px rgba(100,0,200,0.3)",
        width: "100%",
        maxWidth: "1100px", // ✅ Wider container
        minHeight: "550px",
        animation: "fadeIn 1s ease-in-out",
      }}
    >
      <h2
        className="text-4xl font-extrabold mb-8 text-center tracking-wide"
        style={{
          background:
            "linear-gradient(90deg, #c084fc, #ec4899, #60a5fa)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 30px rgba(180,100,255,0.6)",
        }}
      >
        📜 Your Locked Funds
      </h2>

      {locks.length === 0 ? (
        <p
          className="text-center italic"
          style={{
            color: "#aaa",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          No lock history found.
        </p>
      ) : (
        <div
          className="overflow-auto rounded-2xl border bg-black/50 shadow-inner backdrop-blur-md"
          style={{
            borderColor: "rgba(180,100,255,0.25)",
            maxHeight: "420px",
            overflowX: "auto", // ✅ allow horizontal scroll
            scrollbarWidth: "thin",
          }}
        >
          <table
            className="min-w-[1000px] text-base font-semibold" // ✅ ensure table is wide
            style={{
              color: "#e5e0ff",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead
              style={{
                background:
                  "linear-gradient(90deg, rgba(120,50,200,0.4), rgba(230,30,150,0.4))",
                borderBottom: "1px solid rgba(180,100,255,0.3)",
                fontWeight: "800",
              }}
            >
              <tr>
                <th className="p-4 text-left w-16">#</th>
                <th className="p-4 text-left w-80">Nominee</th>
                <th className="p-4 text-left w-64">Amount (ETH)</th>
                <th className="p-4 text-left w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {locks.map((lock, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: "1px solid rgba(150,50,255,0.15)",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:bg-purple-800/30 hover:shadow-[0_0_20px_rgba(180,100,255,0.2)]"
                >
                  <td className="p-4 text-gray-400 font-bold">
                    {locks.length - i}
                  </td>
                  <td className="p-4 break-all font-medium">{lock.nominee}</td>
                  <td
                    className="p-4 text-purple-300 font-extrabold"
                    style={{
                      whiteSpace: "nowrap",
                      wordBreak: "keep-all",
                    }}
                  >
                    {ethers.formatEther(lock.amount)} ETH
                  </td>
                  <td className="p-4">
                    {lock.released ? (
                      <span style={{ color: "#22c55e", fontWeight: "800" }}>
                        ✅ Released
                      </span>
                    ) : (
                      <span style={{ color: "#facc15", fontWeight: "800" }}>
                        ⏳ Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          /* Optional scrollbar styling for a sleeker look */
          ::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(160,80,255,0.4);
            border-radius: 8px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(200,100,255,0.6);
          }
        `}
      </style>
    </div>
  );
}
