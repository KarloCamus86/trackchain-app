import { network } from "hardhat";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ETHERSCAN_BASE = "https://sepolia.etherscan.io/address";

async function main() {
  const { ethers, networkName } = await network.connect();
  const [deployer] = await ethers.getSigners();

  console.log("\n🚀 Deploying TraceChain contracts...");
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Network:  ${networkName}\n`);

  // ── 1. Deploy ProductRegistry ─────────────────────────────────────────────
  const RegistryFactory = await ethers.getContractFactory("ProductRegistry");
  const registry = await RegistryFactory.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`✅ ProductRegistry  →  ${registryAddress}`);
  if (networkName === "sepolia") {
    console.log(`   🔍 ${ETHERSCAN_BASE}/${registryAddress}`);
  }

  // ── 2. Deploy TraceabilityLog ─────────────────────────────────────────────
  const LogFactory = await ethers.getContractFactory("TraceabilityLog");
  const traceLog = await LogFactory.deploy(registryAddress);
  await traceLog.waitForDeployment();
  const traceLogAddress = await traceLog.getAddress();
  console.log(`✅ TraceabilityLog  →  ${traceLogAddress}`);
  if (networkName === "sepolia") {
    console.log(`   🔍 ${ETHERSCAN_BASE}/${traceLogAddress}`);
  }

  // ── 3. Save addresses to the right file ──────────────────────────────────
  const deploymentsDir = join(process.cwd(), "deployments");
  mkdirSync(deploymentsDir, { recursive: true });

  const outputFile = networkName === "sepolia" ? "sepolia.json" : "local.json";
  const output = {
    ProductRegistry: registryAddress,
    TraceabilityLog: traceLogAddress,
    network:         networkName,
    deployedAt:      new Date().toISOString(),
  };

  writeFileSync(join(deploymentsDir, outputFile), JSON.stringify(output, null, 2));
  console.log(`\n📄 Addresses saved to deployments/${outputFile}`);
  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
