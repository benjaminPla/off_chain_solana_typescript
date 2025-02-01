import * as web3 from "@solana/web3.js";
import * as bip39 from "bip39";
import "dotenv/config";

console.log("[Restore Keypair]: running...");

const mnemonic = process.env.SEED_PHRASE || "";
const seed = bip39.mnemonicToSeedSync(
  mnemonic,
  process.env.MNEMONIC_PASSWORD || "",
);
const keypair = web3.Keypair.fromSeed(seed.subarray(0, 32));

console.log(`[Restored PublicKey]: ${keypair.publicKey.toBase58()}`);
