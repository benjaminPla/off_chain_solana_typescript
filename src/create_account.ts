import * as web3 from "@solana/web3.js";
import {
  createConnection,
  handleError,
  logBalance,
  requestLamportsIfNeeded,
} from "./utils";
import { getKeypairFromFile } from "@solana-developers/helpers";

const createAccount = async () => {
  try {
    const payerKeyPair = await getKeypairFromFile("~/.config/solana/id.json");
    const newAccountKeyPair = web3.Keypair.generate();

    const connection = createConnection();

    await logBalance(connection, payerKeyPair.publicKey, "Payer");
    await logBalance(connection, newAccountKeyPair.publicKey, "New Account");

    await requestLamportsIfNeeded(connection, payerKeyPair.publicKey);

    const transaction = new web3.Transaction();

    console.log("[createAccountInstructions]: running...");
    const space = 0;
    const rentExemptionAmount =
      await connection.getMinimumBalanceForRentExemption(space);
    console.log(
      `[createAccountInstructions]: rentExemptionAmount is ${rentExemptionAmount}`,
    );
    const createAccountInstructions = web3.SystemProgram.createAccount({
      fromPubkey: payerKeyPair.publicKey,
      newAccountPubkey: newAccountKeyPair.publicKey,
      lamports: rentExemptionAmount,
      space,
      programId: web3.SystemProgram.programId,
    });

    transaction.add(createAccountInstructions);

    console.log("[sendAndConfirmTransaction] running...");
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeyPair, newAccountKeyPair],
    );

    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature}`);
    await logBalance(connection, payerKeyPair.publicKey, "Payer");
    await logBalance(connection, newAccountKeyPair.publicKey, "New Account");
  } catch (error: unknown) {
    handleError(error, true);
  }
};

createAccount();
