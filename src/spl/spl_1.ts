// 1. Creates a new mint
// 2. Gets or creates associated token accounts for owner and recipient
// 3. Mints a fixed amount of tokens to the owner's token account
// 4. Transfers a portion of tokens to the recipient's token account
// The owner retains control over the remaining tokens
// The mint authority remains, so the owner can mint more in the future

import * as web3 from "@solana/web3.js";
import {
  createMint,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import "dotenv/config";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  createConnection,
  handleError,
  requestLamportsIfNeeded,
} from "../utils";

const spl1 = async () => {
  console.log("[spl_1]: running...");
  try {
    const ownerKeypair = await getKeypairFromFile("~/.config/solana/id.json");
    const recipientKeypair = await getKeypairFromFile(
      "~/.config/solana/keypair_2.json",
    );

    const connection = createConnection();

    await requestLamportsIfNeeded(
      connection,
      ownerKeypair.publicKey,
      2 * web3.LAMPORTS_PER_SOL,
      1 * web3.LAMPORTS_PER_SOL,
    );

    console.log("[createMint]: running...");
    const mint = await createMint(
      connection,
      ownerKeypair,
      ownerKeypair.publicKey,
      null,
      9,
    );
    console.log(`[mint]: ${mint}`);

    const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerKeypair,
      mint,
      ownerKeypair.publicKey,
    );
    console.log(`[ownerTokenAccount.address]: ${ownerTokenAccount.address}`);

    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerKeypair,
      mint,
      recipientKeypair.publicKey,
    );
    console.log(
      `[recipientTokenAccount.address]: ${recipientTokenAccount.address}`,
    );

    const mintAmount = 10;
    console.log("[mintTo] running...");
    await mintTo(
      connection,
      ownerKeypair,
      mint,
      ownerTokenAccount.address,
      ownerKeypair.publicKey,
      mintAmount * web3.LAMPORTS_PER_SOL,
      [],
    );
    console.log(`[mintTo] created ${mintAmount} spl`);

    const transactionAmount = 1;
    const transaction = new web3.Transaction().add(
      createTransferInstruction(
        ownerTokenAccount.address,
        recipientTokenAccount.address,
        ownerKeypair.publicKey,
        transactionAmount * web3.LAMPORTS_PER_SOL,
        [],
      ),
    );
    console.log(`[createTransferInstruction] amount: ${transactionAmount} spl`);

    console.log("[sendAndConfirmTransaction] running...");
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [ownerKeypair],
    );

    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature}`);

    console.log("[mintTo] running...");
    await mintTo(
      connection,
      ownerKeypair,
      mint,
      ownerTokenAccount.address,
      ownerKeypair.publicKey,
      mintAmount * web3.LAMPORTS_PER_SOL,
    );
    console.log(`[mintTo] created ${mintAmount} spl`);
  } catch (error: unknown) {
    handleError(error, true);
  }
};

spl1();
