import * as web3 from "@solana/web3.js";
import {
  createConnection,
  createPDA,
  handleError,
  logAccountInfo,
  requestLamportsIfNeeded,
} from "../utils";
import "dotenv/config";
import { getKeypairFromFile } from "@solana-developers/helpers";

const u32ToBytes = (number: number) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(number, 0);
  return buffer;
};

const writeData = async () => {
  console.log("[Write Data]: running...");
  try {
    const payerKeyPair = await getKeypairFromFile("~/.config/solana/id.json");
    const programPublicKey = new web3.PublicKey(process.env.PROGRAM_ID || "");
    const [pda, _bump] = createPDA(payerKeyPair.publicKey, programPublicKey);

    const connection = createConnection();

    await requestLamportsIfNeeded(connection, payerKeyPair.publicKey);

    console.log("[newDatAccount] creating...");
    const newDatAccountKeypair = web3.Keypair.generate();

    const transaction1 = new web3.Transaction();

    const space = 4;
    const lamports = await connection.getMinimumBalanceForRentExemption(space);
    const instructions1 = web3.SystemProgram.createAccount({
      fromPubkey: payerKeyPair.publicKey,
      newAccountPubkey: newDatAccountKeypair.publicKey,
      lamports,
      space,
      programId: programPublicKey,
    });

    transaction1.add(instructions1);

    console.log("[sendAndConfirmTransaction] running...");
    const signature1 = await web3.sendAndConfirmTransaction(
      connection,
      transaction1,
      [payerKeyPair, newDatAccountKeypair],
    );

    console.log("[newDatAccount] done");
    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature1}`);
    logAccountInfo(
      connection,
      newDatAccountKeypair.publicKey,
      "New Data Account",
    );

    console.log("[writeProgramData] running...");
    const transaction2 = new web3.Transaction();
    const instructions2 = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: newDatAccountKeypair.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: payerKeyPair.publicKey,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: programPublicKey,
      data: u32ToBytes(2),
    });

    transaction2.add(instructions2);

    console.log("[sendAndConfirmTransaction] running...");
    const signature2 = await web3.sendAndConfirmTransaction(
      connection,
      transaction2,
      [payerKeyPair],
    );

    console.log("[writeProgramData] done");
    console.log("[Transaction successful!]");
    console.log(`[Signature:] ${signature2}`);
    logAccountInfo(
      connection,
      newDatAccountKeypair.publicKey,
      "New Data Account",
    );
  } catch (error: unknown) {
    handleError(error, true);
  }
};

writeData();
