import React, { useState } from "react";
import { ethers } from "ethers";
import { useStateTogether } from "react-together";

const CONTRACT_ADDRESS = "0x5ACC3F21422B87c81836D2fdBe99A8412839070d";
const ABI = [
  {
    "inputs": [{ "internalType": "bytes32", "name": "hash", "type": "bytes32" }],
    "name": "commitProphecy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function normalizeDateInput(input) {
  if (/^\d{1,2}\.[A-Za-z]+$/.test(input)) return input;
  const match = input.match(/^(\d{1,2})[\.\-/ ]?(\d{1,2})$/);
  if (match) {
    const day = match[1];
    const monthIdx = parseInt(match[2], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day}.${MONTHS[monthIdx]}`;
    }
  }
  return input;
}

export default function App() {
  const [wallet, setWallet] = useState({ address: null, signer: null });
  const [dateInput, setDateInput] = useState("");
  const [stickers, setStickers] = useStateTogether("tge-wall-stickers", []);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask or OKX Wallet");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWallet({ address, signer });
    } catch (e) {
      alert("Wallet connection failed: " + e.message);
    }
  }

  function addProphecy() {
    if (!dateInput) return;
    const normalized = normalizeDateInput(dateInput.trim());
    const pos = {
      x: 60 + Math.round(Math.random() * 620),
      y: 30 + Math.round(Math.random() * 340)
    };
    setStickers([
      ...stickers,
      {
        date: normalized,
        x: pos.x,
        y: pos.y,
        author: wallet.address
      }
    ]);
    setDateInput("");
  }

  async function sendToBlockchain() {
    if (!wallet.signer || !stickers.length) return;
    const date = stickers[stickers.length - 1].date;
    if (!date) return;
    setLoading(true);
    setTxHash(null);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet.signer);
      const hash = ethers.id(date);
      const tx = await contract.commitProphecy(hash);
      await tx.wait();
      setTxHash(tx.hash);
      alert("Transaction successful!");
    } catch (e) {
      alert("Transaction failed: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #141413 0%, #19181e 100%)",
        color: "#fff",
        fontFamily: "'Inter', 'Montserrat', 'Arial', sans-serif",
        paddingTop: 30
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: "0 auto"
      }}>
        <h1 style={{
          color: "#ffae42",
          fontSize: 44,
          marginBottom: 12,
          letterSpacing: "1px",
          fontWeight: 800,
          textShadow: "0 2px 14px #000"
        }}>
          TGE Prophecy Wall
        </h1>

        {/* ВАЖНЫЙ ТЕКСТ! */}
        <div style={{
          margin: "10px 0 22px 0",
          fontSize: 21,
          fontWeight: 500,
          color: "#ffd77c",
          textAlign: "center",
          letterSpacing: "0.5px"
        }}>
          Guess the <b style={{color:'#ffae42'}}>TGE MONAD</b> date! <br />
          Enter your prediction (for example: <b>15.July</b> or <b>7.September</b>).
        </div>

        <div style={{ marginBottom: 18 }}>
          {wallet.address ? (
            <span style={{ color: "#ffae42", fontWeight: "bold" }}>
              Connected: {wallet.address.slice(0, 6) + "..." + wallet.address.slice(-4)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              style={{
                padding: "12px 30px",
                borderRadius: 10,
                fontSize: 20,
                background: "#232323",
                color: "#ffae42",
                border: "2px solid #ffae42",
                cursor: "pointer"
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>

        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          margin: "40px 0 0 0",
          background: "linear-gradient(125deg,#232324 70%,#262335 100%)",
          borderRadius: 40,
          boxShadow: "0 8px 64px #000c",
          padding: 46,
          minWidth: 900
        }}>
          <div
            style={{
              width: 740,
              height: 400,
              background: "#19191a",
              borderRadius: 32,
              position: "relative",
              overflow: "hidden"
            }}
          >
            {stickers.map((sticker, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: sticker.x,
                  top: sticker.y,
                  background: "#ffae42",
                  color: "#232323",
                  borderRadius: 10,
                  padding: "10px 22px",
                  fontSize: 22,
                  fontWeight: "bold",
                  userSelect: "none",
                  boxShadow: "0 2px 12px #0007"
                }}
                title={sticker.author ? sticker.author : ""}
              >
                {sticker.date}
              </div>
            ))}
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 40,
            background: "#232323",
            borderRadius: 24,
            boxShadow: "0 4px 24px #0006",
            padding: "36px 28px",
            minWidth: 340,
            alignItems: "center",
            height: 370,
            gap: 24,
            justifyContent: "flex-start"
          }}>
            <div style={{ fontSize: 21, fontWeight: 600, color: "#ffae42", marginBottom: 10 }}>
              Your Prophecy
            </div>
            <input
              type="text"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              placeholder="Day.Month (ex: 5.July or 31.August or 10.02)"
              style={{
                fontSize: 22,
                padding: "14px 20px",
                borderRadius: 10,
                border: "2px solid #ffae42",
                background: "#19191a",
                color: "#fff",
                fontWeight: 600,
                letterSpacing: 1,
                width: "100%",
                marginBottom: 4
              }}
            />
            <button
              onClick={addProphecy}
              disabled={!dateInput}
              style={{
                background: "#ffae42",
                color: "#171717",
                fontWeight: "bold",
                border: "none",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: 20,
                cursor: !dateInput ? "not-allowed" : "pointer",
                width: "100%"
              }}
            >
              Add Prophecy
            </button>
            <button
              onClick={sendToBlockchain}
              disabled={!wallet.signer || !stickers.length || loading}
              style={{
                background: "#ffae42",
                color: "#171717",
                fontWeight: "bold",
                border: "none",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: 20,
                cursor: (!wallet.signer || !stickers.length || loading) ? "not-allowed" : "pointer",
                width: "100%",
                marginTop: 16
              }}
            >
              {loading ? "Submitting..." : "Submit Prophecy"}
            </button>
            {txHash && (
              <div style={{ marginTop: 10, fontSize: 15 }}>
                ✅ TX:&nbsp;
                <a
                  href={`https://monadscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#32e" }}
                >
                  {txHash.slice(0, 10) + "..."}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
