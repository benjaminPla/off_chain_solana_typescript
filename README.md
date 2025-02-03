# Off-Chain Development

## Overview

This is an off-chain development project built in Node.js + TypeScript that uses `@solana/web3.js` and `@solana-developers/helpers` dependencies. It goes through all the basic actions with the Solana blockchain.

## Structure

```
.
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── add_memo_to_transaction.ts
│   ├── basic_transaction.ts
│   ├── mnemonic.ts
│   ├── ping_counter.ts
│   ├── sign_and_verify_message.ts
│   ├── spl
│   │   ├── spl_1.ts
│   │   ├── spl_2.ts
│   │   ├── spl_3.ts
│   │   └── spl_4.ts
│   └── utils.ts
└── tsconfig.json
```

## Configuration

To configure the project, follow these steps:

1. Create a `.env` file in the project root and add the necessary environment variables:

```
ENVIRONMENT=<your_environment>
MNEMONIC_PASSWORD=<your_passphrase>
SECRET_KEY=<[your_secretkey]>
SEED_PHRASE=<your_seedphrase>
```

## Clusters

The project is built to run on any cluster, but I highly recommend to run it locally.

1. run `solana-test-validator` on your terminal
2. update your _.env_: `ENVIRONMENT="http://localhost:8899"`
3. run the scripts: `ts-node <file>`

## Images

![image](https://github.com/user-attachments/assets/86880a49-599d-4c26-ad27-579b8e7bad12)

![image](https://github.com/user-attachments/assets/1e84b01b-095f-4f3a-8940-7c21912ebf8b)

![image](https://github.com/user-attachments/assets/4911bb5d-5626-4fa9-96fc-0c36831b0eee)

![image](https://github.com/user-attachments/assets/87aadf38-8e73-4105-8050-2f6487d16d7f)

