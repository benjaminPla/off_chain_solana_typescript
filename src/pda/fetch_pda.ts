import * as web3 from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  createConnection,
  handleError,
  requestLamportsIfNeeded,
} from "../utils";

const pingCounter = async (): Promise<void> => {
  console.log("[Ping PDA]: running...");
  try {
    const payerKeyPair = await getKeypairFromFile("~/.config/solana/id.json");
    const PING_PROGRAM_ADDRESS = "2uCaxJwd3p5s53qU3imXYZA7dckuPMWNt1jhCEfhAHD7";
    const programPublicKey = new web3.PublicKey(PING_PROGRAM_ADDRESS);

    const connection = createConnection(web3.clusterApiUrl("devnet"));

    await requestLamportsIfNeeded(connection, payerKeyPair.publicKey);

    const transaction = new web3.Transaction();

    const value = 50;
    const data = Buffer.alloc(8);
    data.writeBigUInt64LE(BigInt(value));

    const instructions = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: programPublicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: payerKeyPair.publicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      programId: programPublicKey,
      data,
    });

    transaction.add(instructions);

    console.log("[sendAndConfirmTransaction] running...");
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeyPair],
    );

    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature}`);
  } catch (error: unknown) {
    handleError(error, true);
  }
};

pingCounter();
