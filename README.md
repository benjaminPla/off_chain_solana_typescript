# Off-Chain Development

## Overview

This is an off-chain development project built in Node.js + TypeScript that uses `@solana/web3.js` and `@solana-developers/helpers` dependencies. It goes through all the basic actions with the Solana blockchain.

## Structure

```
.
├── package.json
├── package-lock.json
├── src
│   ├── basic_transaction.ts
│   ├── mnemonic.ts
│   ├── ping_counter.ts
│   ├── sign_and_verify_message.ts
│   └── utils.ts
└── tsconfig.json
```

## Configuration

To configure the project, follow these steps:

1. Create a `.env` file in the project root and add the necessary environment variables:

```
MNEMONIC_PASSWORD=<your_passphrase>
SECRET_KEY=<[your_secretkey]>
SEED_PHRASE=<your_seedphrase>
```

## Clusters

The project is built to run on the `devnet` cluster, but you can manually change the `connection` to point to `testnet` or `mainnet-beta`.

## Images

![image](https://github.com/user-attachments/assets/6c43a28b-4b45-4713-b541-1f22a7d94e97)

![image](https://github.com/user-attachments/assets/490e5510-fade-4f80-8c4a-5d2ca3e90ec8)
