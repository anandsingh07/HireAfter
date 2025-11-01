import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";

// 1️⃣ Create the Wagmi config
const config = getDefaultConfig({
  appName: "Wallet Lock MVP",
  projectId: "ef8051617e74e1fc0252498b6901d193",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

// 2️⃣ Create a QueryClient instance
const queryClient = new QueryClient();

// 3️⃣ Wrap the app in QueryClientProvider → WagmiProvider → RainbowKitProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
