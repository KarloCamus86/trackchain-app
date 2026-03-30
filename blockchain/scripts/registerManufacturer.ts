import { network } from "hardhat";

const REGISTRY_ADDRESS     = "0x7AFdB695464c241B505464efa3174DD0a8d4139B";
const MANUFACTURER_ADDRESS = "0x141c0F562699908cFaEaAE952bbb08BE1F972488";

async function main() {
  const { ethers, networkName } = await network.connect();
  const [deployer] = await ethers.getSigners();

  console.log("\n🔧 Registering manufacturer...");
  console.log(`   Network:      ${networkName}`);
  console.log(`   Caller:       ${deployer.address}`);
  console.log(`   Registry:     ${REGISTRY_ADDRESS}`);
  console.log(`   Manufacturer: ${MANUFACTURER_ADDRESS}\n`);

  const registry = await ethers.getContractAt("ProductRegistry", REGISTRY_ADDRESS);

  const tx = await registry.registerManufacturer(MANUFACTURER_ADDRESS);
  await tx.wait();

  console.log(`✅ Manufacturer registered successfully`);
  console.log(`   TX hash: ${tx.hash}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
