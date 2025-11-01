// src/utils/api.js
const BASE_URL = "http://localhost:5000/api"; // adjust if deployed

export const linkTwitter = async (walletAddress, twitterHandle, nominees) => {
  const res = await fetch(`${BASE_URL}/users/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress, twitterHandle, nominees }),
  });
  return res.json();
};

export const mockTweet = async (walletAddress) => {
  const res = await fetch(`${BASE_URL}/users/mockTweet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return res.json();
};

export const getUser = async (walletAddress) => {
  const res = await fetch(`${BASE_URL}/users/${walletAddress}`);
  return res.json();
};
