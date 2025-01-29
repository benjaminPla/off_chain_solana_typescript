import { airdropIfRequired } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";

export const getBalance = async (
  connection: web3.Connection,
  pubKey: web3.PublicKey,
  info: string = "Account",
): Promise<number> => {
  console.log("[getBalance]: running...");
  try {
    const balance = await connection.getBalance(pubKey);
    const solBalance = balance / web3.LAMPORTS_PER_SOL;
    console.log(`[${info} Balance]: ${solBalance} SOL`);
    return solBalance;
  } catch (error) {
    throw new Error(`[getBalance]: ${error?.toString() ?? "unknown error"}`);
  }
};

export const getAccountInfo = async (
  connection: web3.Connection,
  pubKey: web3.PublicKey,
  info: string = "Account",
): Promise<void> => {
  console.log("[getAccountInfo]: running...");
  try {
    const accountInfo = await connection.getAccountInfo(pubKey);
    const dataBuffer = accountInfo?.data;
    const data = dataBuffer?.readUInt32LE(0);
    console.log(`[${info} Data]: ${data}`);
  } catch (error: unknown) {
    throw new Error(`[getData]: ${error?.toString() ?? "unknown error"}`);
  }
};

export const requestLamportsIfNeeded = async (
  connection: web3.Connection,
  pubKey: web3.PublicKey,
): Promise<void> => {
  console.log("[requestLamportsIfNeeded]: running...");
  try {
    await airdropIfRequired(
      connection,
      pubKey,
      1 * web3.LAMPORTS_PER_SOL,
      0.5 * web3.LAMPORTS_PER_SOL,
    );
    console.log("[requestLamportsIfNeeded]: done");
  } catch (error: unknown) {
    throw new Error(
      `[requestLamportsIfNeeded]: ${error?.toString() ?? "unknown error"}`,
    );
  }
};
