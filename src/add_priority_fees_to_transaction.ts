import * as web3 from "@solana/web3.js";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  createConnection,
  handleError,
  logBalance,
  requestLamportsIfNeeded,
} from "./utils";

const addPriorityFeesToTransaction = async () => {
  console.log("[addPriorityFee]: running...");
  try {
    const senderKeypair = await getKeypairFromFile("~/.config/solana/id.json");
    const recipientKeypair = await getKeypairFromFile(
      "~/.config/solana/keypair_2.json",
    );

    const connection = createConnection();

    await logBalance(connection, senderKeypair.publicKey, "Sender");
    await logBalance(connection, recipientKeypair.publicKey, "Recipient");

    await requestLamportsIfNeeded(connection, senderKeypair.publicKey);

    const transaction = new web3.Transaction();

    const instructions = web3.SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: recipientKeypair.publicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.1,
    });

    const units = 1_000_000;
    console.log(`[modifyComputeUnits]: ${units} units`);
    const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
      units,
    });

    console.log("[getRecentPrioritizationFees]: running...");
    let microLamports = 1;
    const recentFees = await connection.getRecentPrioritizationFees();
    if (recentFees && recentFees.length > 0) {
      microLamports =
        recentFees[Math.floor(recentFees.length / 2)].prioritizationFee;
    }

    console.log(`[addPriorityFee]: ${microLamports} microLamports`);
    const addPriorityFee = web3.ComputeBudgetProgram.setComputeUnitPrice({
      microLamports,
    });

    transaction.add(instructions);
    transaction.add(modifyComputeUnits);
    transaction.add(addPriorityFee);

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

addPriorityFeesToTransaction();
