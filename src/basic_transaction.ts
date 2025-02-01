import * as web3 from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  createConnection,
  handleError,
  logBalance,
  requestLamportsIfNeeded,
} from "./utils";

const basicTransaction = async (): Promise<void> => {
  console.log("[Basic Transaction]: running...");
  try {
    const senderKeypair = await getKeypairFromFile("~/.config/solana/id.json");
    const recipientKeypair = await getKeypairFromFile(
      "~/.config/solana/keypair_2.json",
    );

    const connection = createConnection();

    await logBalance(connection, senderKeypair.publicKey, "Sender");
    await logBalance(connection, recipientKeypair.publicKey, "Recipient");

    const transaction = new web3.Transaction();

    await requestLamportsIfNeeded(connection, senderKeypair.publicKey);

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: recipientKeypair.publicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.1,
    });

    transaction.add(sendSolInstruction);

    console.log("[sendAndConfirmTransaction] running...");
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [senderKeypair],
    );

    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature}`);
    await logBalance(connection, senderKeypair.publicKey, "Sender");
    await logBalance(connection, recipientKeypair.publicKey, "Recipient");
  } catch (error: unknown) {
    handleError(error, true);
  }
};

basicTransaction();
