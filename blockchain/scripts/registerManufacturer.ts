import { network } from "hardhat";

const REGISTRY_ADDRESS   = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MANUFACTURER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

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
