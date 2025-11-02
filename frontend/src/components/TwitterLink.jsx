import React, { useState } from "react";

export default function TwitterLink() {
  const [username, setUsername] = useState("");
  const [linked, setLinked] = useState(false);
  const [mockTweet, setMockTweet] = useState(null);

  const handleLink = () => {
    if (!username.trim()) return alert("Enter a valid Twitter username!");
    const tweets = [
      "Exploring the future of blockchain 💎",
      "Just tried an amazing new DApp 👀",
      "Web3 never sleeps 🚀",
      "Smart contracts are changing the world 🔐",
      "Another day, another transaction on-chain 💰",
    ];
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];
    const tweetDate = new Date(
      Date.now() - Math.random() * 86400000
    ).toLocaleString();

    setMockTweet({ text: randomTweet, date: tweetDate });
    setLinked(true);
  };

  return (
    <div style={container}>
      <h2 style={heading}>🐦 Link Your X</h2>

      {!linked ? (
        <>
          <input
            type="text"
            placeholder="Enter your X username (without @)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleLink} style={buttonStyle}>
            🔗 Link X
          </button>
        </>
      ) : (
        <div style={tweetBox}>
          <p style={linkedUser}>✅ Linked @{username}</p>
          <blockquote style={tweetText}>“{mockTweet.text}”</blockquote>
          <p style={tweetDateStyle}>Posted on {mockTweet.date}</p>
          <a
            href={`https://twitter.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            style={twitterLink}
          >
            🌌 Visit Profile
          </a>
        </div>
      )}
    </div>
  );
}

// === Styles ===
const container = {
  textAlign: "center",
  padding: "2rem",
  borderRadius: "20px",
  background: "linear-gradient(135deg, rgba(0,50,50,0.4), rgba(10,10,30,0.7))",
  border: "1px solid rgba(100,255,255,0.2)",
  boxShadow: "0 0 25px rgba(0,200,255,0.2), inset 0 0 20px rgba(0,150,255,0.2)",
  backdropFilter: "blur(14px)",
  animation: "fadeIn 1.2s ease-in-out",
};

const heading = {
  fontSize: "2rem",
  fontWeight: "700",
  background: "linear-gradient(90deg, #1da1f2, #a855f7)",
  WebkitBackgroundClip: "text",
  color: "transparent",
  textShadow: "0 0 10px rgba(100,100,255,0.5)",
  marginBottom: "1.5rem",
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
  background: "linear-gradient(90deg, #1da1f2, #a855f7)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 0 20px rgba(29,161,242,0.4)",
  transition: "all 0.3s ease",
};

const tweetBox = {
  background: "rgba(0,0,0,0.4)",
  padding: "1.5rem",
  borderRadius: "15px",
  border: "1px solid rgba(100,255,255,0.2)",
  marginTop: "1rem",
  boxShadow: "inset 0 0 20px rgba(0,150,255,0.2)",
};

const linkedUser = {
  color: "#4ade80",
  fontWeight: "600",
  marginBottom: "0.8rem",
};

const tweetText = {
  fontStyle: "italic",
  color: "#bae6fd",
  fontSize: "1.1rem",
};

const tweetDateStyle = {
  color: "rgba(200,200,255,0.7)",
  fontSize: "0.85rem",
  marginTop: "0.5rem",
};

const twitterLink = {
  display: "inline-block",
  marginTop: "1rem",
  padding: "0.6rem 1.3rem",
  borderRadius: "10px",
  background: "linear-gradient(90deg, #1da1f2, #a855f7)",
  color: "white",
  fontWeight: "600",
  textDecoration: "none",
  boxShadow: "0 0 15px rgba(29,161,242,0.5)",
  transition: "all 0.3s ease",
};

// Animation for smooth entry
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
