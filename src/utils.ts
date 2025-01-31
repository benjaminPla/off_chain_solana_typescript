import { airdropIfRequired } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";
import "dotenv/config";

export const createConnection = (environment?: string) => {
  console.log("[createConnection]: running...");
  const env =
    environment || process.env.ENVIRONMENT || web3.clusterApiUrl("devnet");
  if (!environment && !process.env.ENVIRONMENT) {
    console.warn(
      "[createConnection]: ENVIRONMENT env variable is not set. Defaulting to 'dotenv'",
    );
  }
  const connection = new web3.Connection(env, "confirmed");
  console.log("[createConnection]: done");
  return connection;
};

export const logBalance = async (
  connection: web3.Connection,
  pubKey: web3.PublicKey,
  info: string = "Account",
): Promise<number> => {
  console.log("[logBalance]: running...");
  try {
    const balance = await connection.getBalance(pubKey);
    const solBalance = balance / web3.LAMPORTS_PER_SOL;
    console.log(`[${info} Balance]: ${solBalance} SOL`);
    return solBalance;
  } catch (error) {
    throw new Error(`[logBalance]: ${error?.toString() ?? "unknown error"}`);
  }
};

export const logAccountInfo = async (
  connection: web3.Connection,
  pubKey: web3.PublicKey,
  info: string = "Account",
): Promise<void> => {
  console.log("[logAccountInfo]: running...");
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
  amount: number = 1 * web3.LAMPORTS_PER_SOL,
  minimunBalance: number = 1 * web3.LAMPORTS_PER_SOL,
): Promise<void> => {
  console.log("[requestLamportsIfNeeded]: running...");
  try {
    await airdropIfRequired(connection, pubKey, amount, minimunBalance);
    console.log("[requestLamportsIfNeeded]: done");
  } catch (error: unknown) {
    throw new Error(
      `[requestLamportsIfNeeded]: ${error?.toString() ?? "unknown error"}`,
    );
  }
};
