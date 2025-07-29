import React, { useState } from "react";
import { ethers } from "ethers";

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

export default function SubmitProphecy({ date, signer }) {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  async function sendProphecy() {
    if (!date || !signer) return;
    setLoading(true);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const hash = ethers.id(date); // bytes32 hash
      const tx = await contract.commitProphecy(hash);
      await tx.wait();
      setTxHash(tx.hash);
    } catch (e) {
      alert("Transaction failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  // Кнопка активна только если есть signer и не пустая дата и не идёт loading!
  return (
    <div style={{ marginTop: 18 }}>
      <button
        disabled={!date || !signer || loading}
        onClick={sendProphecy}
        style={{
          padding: "12px 30px",
          borderRadius: 10,
          fontSize: 20,
          background: loading ? "#aaa" : "#ffae42",
          color: "#191919",
          border: "none",
          cursor: (!date || !signer || loading) ? "not-allowed" : "pointer",
          fontWeight: "bold",
          width: "100%"
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
  );
}
