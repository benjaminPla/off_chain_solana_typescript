// 1. Creates a new mint
// 2. Gets or creates associated token accounts for owner, recipient1 and recipient2
// 3. Mints a fixed amount of tokens to the owner's token account
// 4. Transfers a portion of tokens to the recipient1's token account
// 5. Freezes recipient1's token account
// 6. Fails trying to transfer tokens to recipient1's token account
// 7. Transfers a portion of tokens to the another recipient2's token account
// 8. Thaws mint for recipient1's token account
// 9. Transfers a portion of tokens to the recipient1's token account

import * as web3 from "@solana/web3.js";
import {
  createMint,
  createTransferInstruction,
  freezeAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  thawAccount,
} from "@solana/spl-token";
import "dotenv/config";
import { getKeypairFromFile } from "@solana-developers/helpers";
import { createConnection, requestLamportsIfNeeded } from "../utils";

const spl3 = async () => {
  console.log("[spl_1]: running...");
  try {
    const ownerKeypair = await getKeypairFromFile("~/.config/solana/id.json");
    const recipientKeypair1 = await getKeypairFromFile(
      "~/.config/solana/keypair_2.json",
    );
    const recipientKeypair2 = await getKeypairFromFile(
      "~/.config/solana/keypair_3.json",
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
      ownerKeypair.publicKey,
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

    const recipient1TokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerKeypair,
      mint,
      recipientKeypair1.publicKey,
    );
    console.log(
      `[recipient1TokenAccount.address]: ${recipient1TokenAccount.address}`,
    );

    const recipient2TokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerKeypair,
      mint,
      recipientKeypair2.publicKey,
    );
    console.log(
      `[recipient2TokenAccount.address]: ${recipient2TokenAccount.address}`,
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
    const transaction1 = new web3.Transaction().add(
      createTransferInstruction(
        ownerTokenAccount.address,
        recipient1TokenAccount.address,
        ownerKeypair.publicKey,
        transactionAmount * web3.LAMPORTS_PER_SOL,
        [],
      ),
    );
    console.log(`[createTransferInstruction] amount: ${transactionAmount} spl`);

    console.log("[sendAndConfirmTransaction] running...");
    const signature1 = await web3.sendAndConfirmTransaction(
      connection,
      transaction1,
      [ownerKeypair],
    );

    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature1}`);

    await freezeAccount(
      connection,
      ownerKeypair,
      recipient1TokenAccount.address,
      mint,
      ownerKeypair.publicKey,
    );

    console.log("[freezeAccount]: recipient1TokenAccount freezed");
    try {
      const transaction2 = new web3.Transaction().add(
        createTransferInstruction(
          ownerTokenAccount.address,
          recipient1TokenAccount.address,
          ownerKeypair.publicKey,
          transactionAmount * web3.LAMPORTS_PER_SOL,
          [],
        ),
      );
      console.log(
        `[createTransferInstruction] amount: ${transactionAmount} spl`,
      );

      console.log("[sendAndConfirmTransaction] running...");
      const signature2 = await web3.sendAndConfirmTransaction(
        connection,
        transaction2,
        [ownerKeypair],
      );

      console.log("[Transaction successful!]");
      console.log(`[Signature:] ${signature2}`);
    } catch (error: unknown) {
      console.error(
        "Error while transfering: recipient1TokenAccount is freezed",
      );
    }

    const transaction3 = new web3.Transaction().add(
      createTransferInstruction(
        ownerTokenAccount.address,
        recipient2TokenAccount.address,
        ownerKeypair.publicKey,
        transactionAmount * web3.LAMPORTS_PER_SOL,
        [],
      ),
    );
    console.log(`[createTransferInstruction] amount: ${transactionAmount} spl`);

    console.log("[sendAndConfirmTransaction] running...");
    const signature3 = await web3.sendAndConfirmTransaction(
      connection,
      transaction3,
      [ownerKeypair],
    );

    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature3}`);

    await thawAccount(
      connection,
      ownerKeypair,
      recipient1TokenAccount.address,
      mint,
      ownerKeypair.publicKey,
    );

    const transaction4 = new web3.Transaction().add(
      createTransferInstruction(
        ownerTokenAccount.address,
        recipient1TokenAccount.address,
        ownerKeypair.publicKey,
        transactionAmount * web3.LAMPORTS_PER_SOL,
        [],
      ),
    );
    console.log(`[createTransferInstruction] amount: ${transactionAmount} spl`);

    console.log("[sendAndConfirmTransaction] running...");
    const signature4 = await web3.sendAndConfirmTransaction(
      connection,
      transaction4,
      [ownerKeypair],
    );

    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature4}`);
  } catch (error: unknown) {
    throw new Error(`[basicTransaction]: ${error?.toString() ?? "unknown"}`);
  }
};

spl3();
