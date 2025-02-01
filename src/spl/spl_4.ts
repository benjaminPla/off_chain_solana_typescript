// 1. Creates a new mint
// 2. Gets or creates associated token accounts for owner, recipient1 and recipient2
// 3. Mints a fixed amount of tokens as the owner to the owner's token account
// 4. Mints a fixed amount of tokens not as the owner to the owner's token account
// 5. Fails trying to mint tokens
// 6. Mints a fixed amount of tokens not as the owner to not the owner's token account
// 7. Fails trying to mint tokens

import * as web3 from "@solana/web3.js";
import {
  createMint,
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

const spl4 = async () => {
  console.log("[spl_4]: running...");
  try {
    const ownerKeypair = await getKeypairFromFile("~/.config/solana/id.json");
    const notOwnerKeypair = await getKeypairFromFile(
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

    const notOwnerTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerKeypair,
      mint,
      notOwnerKeypair.publicKey,
    );
    console.log(
      `[notOwnerTokenAccount.address]: ${notOwnerTokenAccount.address}`,
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
    console.log(
      `[mintTo]:\n\tamount: ${mintAmount}\n\tsigner: ${ownerKeypair.publicKey}\n\tto: ${ownerTokenAccount.address}`,
    );

    try {
      console.log("[mintTo] running...");
      await mintTo(
        connection,
        notOwnerKeypair,
        mint,
        ownerTokenAccount.address,
        ownerKeypair.publicKey,
        mintAmount * web3.LAMPORTS_PER_SOL,
        [],
      );
      console.log(
        `[mintTo]:\n\tamount: ${mintAmount}\n\tsigner: ${notOwnerKeypair.publicKey}\n\tto: ${ownerTokenAccount.address}`,
      );
    } catch (error: unknown) {
      handleError(error);
    }

    try {
      console.log("[mintTo] running...");
      await mintTo(
        connection,
        notOwnerKeypair,
        mint,
        notOwnerTokenAccount.address,
        ownerKeypair.publicKey,
        mintAmount * web3.LAMPORTS_PER_SOL,
        [],
      );
      console.log(
        `[mintTo]:\n\tamount: ${mintAmount}\n\tsigner: ${notOwnerKeypair.publicKey}\n\tto: ${notOwnerTokenAccount.address}`,
      );
    } catch (error: unknown) {
      handleError(error);
    }
  } catch (error: unknown) {
    handleError(error, true);
  }
};

spl4();
