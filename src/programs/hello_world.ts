import * as web3 from "@solana/web3.js";
import {
  createConnection,
  handleError,
  requestLamportsIfNeeded,
} from "../utils";
import { getKeypairFromFile } from "@solana-developers/helpers";

const helloWorld = async () => {
  console.log("[Hello World]: running...");
  try {
    const payerKeyPair = await getKeypairFromFile("~/.config/solana/id.json");
    const programPublicKey = new web3.PublicKey(
      "FutKDtWfCYRFDpyRAKGR1KJpGt3hxDCHHASMVXuy7iT8",
    );

    const connection = createConnection();

    await requestLamportsIfNeeded(connection, payerKeyPair.publicKey);

    const transaction = new web3.Transaction();
    const instructions = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: programPublicKey,
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
  } catch (error: unknown) {
    handleError(error, true);
  }
};

helloWorld();
