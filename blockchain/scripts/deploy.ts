import { network } from "hardhat";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function main() {
  const { ethers, networkName } = await network.connect();
  const [deployer] = await ethers.getSigners();

  console.log("\n🚀 Deploying TraceChain contracts...");
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Network:  ${networkName}\n`);

  // ── 1. Deploy ProductRegistry ──────────────────────────────────────────────
  const RegistryFactory = await ethers.getContractFactory("ProductRegistry");
  const registry = await RegistryFactory.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`✅ ProductRegistry  →  ${registryAddress}`);

  // ── 2. Deploy TraceabilityLog (depends on ProductRegistry address) ─────────
  const LogFactory = await ethers.getContractFactory("TraceabilityLog");
  const traceLog = await LogFactory.deploy(registryAddress);
  await traceLog.waitForDeployment();
  const traceLogAddress = await traceLog.getAddress();
  console.log(`✅ TraceabilityLog  →  ${traceLogAddress}`);

  // ── 3. Write deployments/local.json ───────────────────────────────────────
  const deploymentsDir = join(process.cwd(), "deployments");
  mkdirSync(deploymentsDir, { recursive: true });

  const output = {
    ProductRegistry: registryAddress,
    TraceabilityLog: traceLogAddress,
    network:         networkName,
    deployedAt:      new Date().toISOString(),
  };

  const outputPath = join(deploymentsDir, "local.json");
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n📄 Deployment info saved to deployments/local.json`);
  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
