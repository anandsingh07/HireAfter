import React, { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import LockFunds from "./components/LockFunds";
import WithdrawFunds from "./components/WithdrawFunds";
import ViewLocks from "./components/ViewLocks";
import TwitterLink from "./components/TwitterLink";

export default function App() {
  useEffect(() => {
    // Galaxy star background animation
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const stars = Array(200)
      .fill()
      .map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2,
        o: Math.random(),
      }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.fill();
        s.o += (Math.random() - 0.5) * 0.02;
        s.o = Math.max(0.2, Math.min(1, s.o));
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Smooth page scrolling
    document.body.style.overflowY = "auto";
    document.body.style.scrollBehavior = "smooth";

    return () => {
      document.body.removeChild(canvas);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <Router>
      <div
        className="min-h-screen flex flex-col"
        style={{
          color: "white",
          textShadow: "0 0 10px rgba(255,255,255,0.3)",
          background:
            "radial-gradient(circle at 20% 30%, rgba(120,0,255,0.3), transparent 60%), radial-gradient(circle at 80% 70%, rgba(0,150,255,0.25), transparent 60%), #000",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(180,100,255,0.2)",
            padding: "1.5rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              background: "linear-gradient(90deg, #a855f7, #ec4899, #3b82f6)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "1px",
              textShadow: "0 0 12px rgba(180,100,255,0.5)",
            }}
          >
            💼 HIREAFTER - LifeGaurd
          </h1>
          <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <NavLink to="/">X</NavLink>
            <NavLink to="/lock">Lock</NavLink>
            <NavLink to="/withdraw">Withdraw</NavLink>
            <NavLink to="/view">View</NavLink>
            <div style={{ transform: "scale(1.05)" }}>
              <ConnectButton />
            </div>
          </nav>
        </header>

        {/* MAIN */}
        <main
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "2rem",
            overflowY: "auto",
            minHeight: "calc(100vh - 160px)", // keeps full page height with scroll
          }}
        >
          <div style={{ width: "100%", maxWidth: "480px", margin: "auto" }}>
            <Routes>
              <Route path="/" element={<Section><TwitterLink /></Section>} />
              <Route path="/lock" element={<Section><LockFunds /></Section>} />
              <Route path="/withdraw" element={<Section><WithdrawFunds /></Section>} />
              <Route path="/view" element={<Section><ViewLocks /></Section>} />
            </Routes>
          </div>
        </main>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            padding: "1rem",
            borderTop: "1px solid rgba(180,100,255,0.2)",
            backdropFilter: "blur(5px)",
            color: "rgba(200,200,255,0.6)",
            fontSize: "0.9rem",
          }}
        >
          ⚡ Built with ❤️ using Ethereum & Galaxy Glass UI ✨
        </footer>
      </div>
    </Router>
  );
}

function Section({ children }) {
  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "2rem",
        background:
          "linear-gradient(135deg, rgba(30,0,60,0.7), rgba(15,15,25,0.8))",
        border: "1px solid rgba(200,100,255,0.3)",
        boxShadow:
          "0 0 20px rgba(150, 0, 255, 0.3), inset 0 0 30px rgba(90, 0, 180, 0.3)",
        backdropFilter: "blur(18px)",
        textAlign: "center",
        animation: "floatBox 6s ease-in-out infinite alternate",
      }}
    >
      {children}
      <style>
        {`
          @keyframes floatBox {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-6px) rotate(0.5deg); }
          }
        `}
      </style>
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: "rgba(220,220,255,0.9)",
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.color = "#fff";
        e.target.style.textShadow = "0 0 8px #a855f7";
      }}
      onMouseLeave={(e) => {
        e.target.style.color = "rgba(220,220,255,0.9)";
        e.target.style.textShadow = "none";
      }}
    >
      {children}
    </Link>
  );
}
