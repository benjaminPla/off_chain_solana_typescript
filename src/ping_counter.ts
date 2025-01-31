import * as web3 from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  createConnection,
  logAccountInfo,
  logBalance,
  requestLamportsIfNeeded,
} from "./utils";

const pingCounter = async (): Promise<void> => {
  console.log("[Ping Counter Program]: running...");
  try {
    const payerKeyPair = await getKeypairFromFile("~/.config/solana/id.json");
    const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
    const programPublicKey = new web3.PublicKey(PING_PROGRAM_ADDRESS);
    const PING_PROGRAM_DATA_ADDRESS =
      "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";
    const programDataPublicKey = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

    const connection = createConnection(web3.clusterApiUrl("devnet"));

    await requestLamportsIfNeeded(connection, payerKeyPair.publicKey);

    await logBalance(connection, payerKeyPair.publicKey, "Payer");
    await logAccountInfo(connection, programDataPublicKey, "Program");

    const transaction = new web3.Transaction();

    const instructions = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: programDataPublicKey,
          isSigner: false,
          isWritable: true,
        },
      ],
      programId: programPublicKey,
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
    await logBalance(connection, payerKeyPair.publicKey, "Payer");
    await logAccountInfo(connection, programDataPublicKey, "Program");
  } catch (error: unknown) {
    throw new Error(`[pingCounter]: ${error?.toString() ?? "unknown"}`);
  }
};

pingCounter();
