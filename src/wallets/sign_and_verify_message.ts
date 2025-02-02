import { decodeUTF8 } from "tweetnacl-util";
import "dotenv/config";
import { getKeypairFromFile } from "@solana-developers/helpers";
import { handleError } from "../utils";
import nacl from "tweetnacl";

const signAndVerifyMessage = async () => {
  console.log("[Sign and Verify Message]: running...");
  try {
    const signerKeypair = await getKeypairFromFile("~/.config/solana/id.json");

    const message = "The quick brown fox jumps over the lazy dog";
    const messageBytes = decodeUTF8(message);
    console.log(`[Message to be signed]: "${message}"`);

    const signature = nacl.sign.detached(messageBytes, signerKeypair.secretKey);
    console.log(`[sign message with signer secret key]: done`);

    const randomKeypair = await getKeypairFromFile(
      "~/.config/solana/keypair_2.json",
    );
    const verifyWithRandomPublicKey = nacl.sign.detached.verify(
      messageBytes,
      signature,
      randomKeypair.publicKey.toBytes(),
    );
    console.log(
      `[verify message with randomPublickKey]: ${verifyWithRandomPublicKey}`,
    );

    const verifyWithSignerPublicKey = nacl.sign.detached.verify(
      messageBytes,
      signature,
      signerKeypair.publicKey.toBytes(),
    );
    console.log(
      `[verify message with signerPublicKey]: ${verifyWithSignerPublicKey}`,
    );
  } catch (error: unknown) {
    handleError(error, true);
  }
};

signAndVerifyMessage();
