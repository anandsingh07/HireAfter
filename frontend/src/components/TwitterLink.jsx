import React from "react";

export default function TwitterLink() {
  return (
    <div style={{ textAlign: "center" }}>
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          background: "linear-gradient(90deg, #3b82f6, #a855f7)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 10px rgba(100,100,255,0.5)",
        }}
      >
        🪐 Follow Us on Twitter
      </h2>

      <p style={{ color: "rgba(220,220,255,0.7)", marginBottom: "1.5rem" }}>
        Stay updated with WalletLock Galaxy’s latest updates and cosmic releases!
      </p>

      <a
        href="https://twitter.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "0.8rem 1.5rem",
          borderRadius: "12px",
          background: "linear-gradient(90deg, #1da1f2, #a855f7)",
          color: "white",
          fontWeight: "600",
          textDecoration: "none",
          boxShadow: "0 0 20px rgba(29,161,242,0.4)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.target.style.boxShadow = "0 0 30px rgba(29,161,242,0.7)")
        }
        onMouseLeave={(e) =>
          (e.target.style.boxShadow = "0 0 20px rgba(29,161,242,0.4)")
        }
      >
        🌌 Visit Twitter
      </a>
    </div>
  );
}
