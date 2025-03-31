export const bundlerABI = [{
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recovery",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "sig",
            "type": "bytes"
          }
        ],
        "internalType": "struct IBundler.RegistrationParams",
        "name": "registerParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "keyType",
            "type": "uint32"
          },
          {
            "internalType": "bytes",
            "name": "key",
            "type": "bytes"
          },
          {
            "internalType": "uint8",
            "name": "metadataType",
            "type": "uint8"
          },
          {
            "internalType": "bytes",
            "name": "metadata",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "sig",
            "type": "bytes"
          }
        ],
        "internalType": "struct IBundler.SignerParams[]",
        "name": "signerParams",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "extraStorage",
        "type": "uint256"
      }
    ],
    "name": "register",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  }]