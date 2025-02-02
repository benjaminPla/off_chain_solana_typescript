import * as web3 from "@solana/web3.js";
import {
  createConnection,
  handleError,
  logBalance,
  requestLamportsIfNeeded,
} from "../utils";
import { getKeypairFromFile } from "@solana-developers/helpers";

const addMemoToTransaction = async () => {
  console.log("[Add Memo to Transaction]: running...");
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

    const memoMessage = "memoMessage";
    const memoInstructions = new web3.TransactionInstruction({
      keys: [
        { pubkey: senderKeypair.publicKey, isSigner: true, isWritable: true },
      ],
      data: Buffer.from(memoMessage, "utf-8"),
      programId: new web3.PublicKey(
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
      ),
    });
    console.log(
      `[memoInstructions]: added message "${memoMessage}" to the transaction`,
    );

    transaction.add(instructions);
    transaction.add(memoInstructions);

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

addMemoToTransaction();
