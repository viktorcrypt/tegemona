import React, { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet({ onConnect }) {
  const [account, setAccount] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or OKX Wallet");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum); // v6!
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      onConnect(address, signer, provider);
    } catch (e) {
      alert("Connection failed: " + e.message);
    }
  };

  return (
    <div>
      {account ? (
        <span style={{ color: "#ffae42" }}>
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      ) : (
        <button
          onClick={connect}
          style={{
            background: "#20232a",
            color: "#fff",
            border: "1px solid #ffae42",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
