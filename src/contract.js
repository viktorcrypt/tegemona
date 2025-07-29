export const CONTRACT_ADDRESS = "0x5ACC3F21422B87c81836D2fdBe99A8412839070d";

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "ProphecyCommitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "commitProphecy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
