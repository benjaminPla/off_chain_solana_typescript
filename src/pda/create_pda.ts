import * as web3 from "@solana/web3.js";

const programId = new web3.PublicKey(
  "2uCaxJwd3p5s53qU3imXYZA7dckuPMWNt1jhCEfhAHD7",
);

const [PDA, bump] = web3.PublicKey.findProgramAddressSync([], programId);

console.log(`PDA: ${PDA}`);
console.log(`Bump: ${bump}`);
