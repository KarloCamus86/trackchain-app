import { expect } from "chai";
import { network } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function deployContracts() {
  const { ethers } = await network.connect();

  const [deployer, manufacturer, stranger]: HardhatEthersSigner[] =
    await ethers.getSigners();

  const RegistryFactory = await ethers.getContractFactory("ProductRegistry");
  const registry = await RegistryFactory.deploy();
  await registry.waitForDeployment();

  const LogFactory = await ethers.getContractFactory("TraceabilityLog");
  const traceLog = await LogFactory.deploy(await registry.getAddress());
  await traceLog.waitForDeployment();

  return { ethers, registry, traceLog, deployer, manufacturer, stranger };
}

/** Deploys, registers manufacturer, and creates one product. Product id = 1n. */
async function deployWithProduct() {
  const ctx = await deployContracts();
  const { registry, deployer, manufacturer } = ctx;

  await registry.connect(deployer).registerManufacturer(manufacturer.address);
  await registry
    .connect(manufacturer)
    .createProduct("Aceite de Oliva Extra Virgen", "Alimentos", "Hacienda Los Olivos");

  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("TraceChain — ProductRegistry + TraceabilityLog", function () {

  // ── ProductRegistry ────────────────────────────────────────────────────────

  describe("ProductRegistry", function () {

    it("1. Registers manufacturer and creates product — product exists with correct data", async function () {
      const { registry, deployer, manufacturer } = await deployContracts();

      await registry.connect(deployer).registerManufacturer(manufacturer.address);
      await registry
        .connect(manufacturer)
        .createProduct("Café Orgánico Sierra Nevada", "Alimentos", "Coop Café del Sur");

      const product = await registry.getProduct(1n);

      expect(product.exists).to.be.true;
      expect(product.id).to.equal(1n);
      expect(product.name).to.equal("Café Orgánico Sierra Nevada");
      expect(product.category).to.equal("Alimentos");
      expect(product.manufacturer).to.equal("Coop Café del Sur");
      expect(product.owner).to.equal(manufacturer.address);
    });

    it("2. getProductCount increments correctly after each createProduct call", async function () {
      const { registry, deployer, manufacturer } = await deployContracts();

      await registry.connect(deployer).registerManufacturer(manufacturer.address);
      expect(await registry.getProductCount()).to.equal(0n);

      await registry.connect(manufacturer).createProduct("Prod A", "Alimentos", "Fab A");
      expect(await registry.getProductCount()).to.equal(1n);

      await registry.connect(manufacturer).createProduct("Prod B", "Textil", "Fab B");
      expect(await registry.getProductCount()).to.equal(2n);

      await registry.connect(manufacturer).createProduct("Prod C", "Farmacéutico", "Fab C");
      expect(await registry.getProductCount()).to.equal(3n);
    });

    it("3. Reverts when a non-manufacturer address tries to create a product", async function () {
      const { registry, stranger } = await deployContracts();

      await expect(
        registry.connect(stranger).createProduct("Fraude", "Alimentos", "Impostor SA")
      ).to.be.revertedWithCustomError(registry, "NotRegisteredManufacturer");
    });

  });

  // ── TraceabilityLog ────────────────────────────────────────────────────────

  describe("TraceabilityLog", function () {

    it("4. Adding 3 events — getEvents returns all 3 with correct stage names", async function () {
      const { traceLog, manufacturer } = await deployWithProduct();

      await traceLog.connect(manufacturer).addEvent(
        1n, "Fabricación", "Jaén, España", "Hacienda Los Olivos", "Prensado en frío a 27 °C"
      );
      await traceLog.connect(manufacturer).addEvent(
        1n, "Almacén", "Sevilla, España", "Almacén Central Sevilla", "Embotellado y etiquetado"
      );
      await traceLog.connect(manufacturer).addEvent(
        1n, "Transporte", "Barcelona, España", "Logística Express", "Enviado a distribuidores"
      );

      const events = await traceLog.getEvents(1n);
      expect(events.length).to.equal(3);
      expect(events[0].stage).to.equal("Fabricación");
      expect(events[1].stage).to.equal("Almacén");
      expect(events[2].stage).to.equal("Transporte");
    });

    it("5. Event timestamps are greater than 0 (set by block.timestamp)", async function () {
      const { traceLog, manufacturer } = await deployWithProduct();

      await traceLog.connect(manufacturer).addEvent(
        1n, "Fabricación", "Jaén", "Hacienda Los Olivos", "Inicio de producción"
      );

      const events = await traceLog.getEvents(1n);
      expect(events.length).to.equal(1);
      expect(events[0].timestamp > 0n).to.be.true;
      expect(events[0].verified).to.be.false;
      expect(events[0].registeredBy).to.equal(manufacturer.address);
    });

    it("6. Reverts when a non-owner address tries to add an event", async function () {
      const { traceLog, stranger } = await deployWithProduct();

      await expect(
        traceLog.connect(stranger).addEvent(
          1n, "Fabricación", "Lugar desconocido", "Intruso", "Evento no autorizado"
        )
      ).to.be.revertedWithCustomError(traceLog, "NotProductOwner");
    });

    it("7. getEventCount matches the number of events added", async function () {
      const { traceLog, manufacturer } = await deployWithProduct();

      expect(await traceLog.getEventCount(1n)).to.equal(0n);

      await traceLog.connect(manufacturer).addEvent(
        1n, "Fabricación", "Jaén", "Fab", "Paso 1"
      );
      expect(await traceLog.getEventCount(1n)).to.equal(1n);

      await traceLog.connect(manufacturer).addEvent(
        1n, "Almacén", "Sevilla", "Almacén", "Paso 2"
      );
      expect(await traceLog.getEventCount(1n)).to.equal(2n);
    });

  });

});
