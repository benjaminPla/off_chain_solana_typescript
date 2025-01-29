import * as web3 from "@solana/web3.js";
import { decodeUTF8 } from "tweetnacl-util";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import nacl from "tweetnacl";

console.log("[SIGN AND VERIFY MESSAGE]");
console.log("\n");

const signerKeypair = getKeypairFromEnvironment("SECRET_KEY");
const signerSecretKey = signerKeypair.secretKey;
const signerPublicKey = new web3.PublicKey(signerKeypair.publicKey);

const message = "The quick brown fox jumps over the lazy dog";
const messageBytes = decodeUTF8(message);
console.log(`[Message to be signed]: "${message}"`);

const signature = nacl.sign.detached(messageBytes, signerSecretKey);
console.log(`[sign message with signerSecretKey]: done`);

const randomKeypair = web3.Keypair.generate();
const verifyWithRandomPublicKey = nacl.sign.detached.verify(
  messageBytes,
  signature,
  new web3.PublicKey(randomKeypair.publicKey).toBytes(),
);
console.log(
  `[verify message with randomPublickKey]: ${verifyWithRandomPublicKey}`,
);

const verifyWithSignerPublicKey = nacl.sign.detached.verify(
  messageBytes,
  signature,
  signerPublicKey.toBytes(),
);
console.log(
  `[verify message with signerPublicKey]: ${verifyWithSignerPublicKey}`,
);
