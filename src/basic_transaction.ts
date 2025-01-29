import * as web3 from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getBalance, requestLamportsIfNeeded } from "./utils";

const basicTransaction = async (): Promise<void> => {
  console.log("[BASIC TRANSACTION]");
  console.log("\n");

  try {
    const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
    const senderPublickey = new web3.PublicKey(senderKeypair.publicKey);

    const recipientKeypair = web3.Keypair.generate();
    const recipientPublickey = new web3.PublicKey(
      recipientKeypair.publicKey.toBase58(),
    );

    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

    await getBalance(connection, senderPublickey, "Sender");
    await getBalance(connection, recipientPublickey, "Recipient");

    const transaction = new web3.Transaction();

    await requestLamportsIfNeeded(connection, senderPublickey);

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: senderPublickey,
      toPubkey: recipientPublickey,
      lamports: web3.LAMPORTS_PER_SOL * 0.1,
    });

    transaction.add(sendSolInstruction);

    console.log("[sendAndConfirmTransaction] running...");
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [senderKeypair],
    );

    console.log("\n");
    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature}`);
    console.log("\n");

    await getBalance(connection, senderPublickey, "Sender");
    await getBalance(connection, recipientPublickey, "Recipient");
  } catch (error: unknown) {
    throw new Error(`[basicTransaction]: ${error?.toString() ?? "unknown"}`);
  }
};

basicTransaction();
