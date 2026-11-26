import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database Looop...");

  // 1. Wilayah Administratif
  const region1 = await prisma.region.create({
    data: {
      regency: "Kabupaten Sleman",
      district: "Kecamatan Depok",
      village: "Desa Caturtunggal",
    },
  });

  const region2 = await prisma.region.create({
    data: {
      regency: "Kabupaten Sleman",
      district: "Kecamatan Mlati",
      village: "Desa Sinduadi",
    },
  });

  // 2. Kategori dan Jenis Sampah
  const catPlastik = await prisma.wasteCategory.create({
    data: {
      name: "Plastik",
      description: "Botol PET, plastik kresek, gelas cup, dan wadah plastik keras",
    },
  });

  const catKertas = await prisma.wasteCategory.create({
    data: {
      name: "Kertas & Kardus",
      description: "Kardus coklat, kertas HVS, koran, dan majalah bekas",
    },
  });

  const catLogam = await prisma.wasteCategory.create({
    data: {
      name: "Logam",
      description: "Kaleng alumunium, besi, tembaga, dan seng",
    },
  });

  const itemPet = await prisma.wasteItem.create({
    data: { name: "Botol PET Bening", unit: "kg", categoryId: catPlastik.id },
  });
  const itemKardus = await prisma.wasteItem.create({
    data: { name: "Kardus Tebal", unit: "kg", categoryId: catKertas.id },
  });
  const itemHvs = await prisma.wasteItem.create({
    data: { name: "Kertas HVS / Arsip", unit: "kg", categoryId: catKertas.id },
  });
  const itemAlumunium = await prisma.wasteItem.create({
    data: { name: "Kaleng Minuman Alumunium", unit: "kg", categoryId: catLogam.id },
  });

  // 3. Bank Sampah
  const bank1 = await prisma.wasteBank.create({
    data: {
      name: "Bank Sampah Sejahtera Lestari",
      code: "BS-CTR-01",
      address: "Jl. Babarsari No. 12, Caturtunggal",
      phone: "081234567890",
      operatingHours: "Senin - Sabtu (08:00 - 15:00 WIB)",
      regionId: region1.id,
      isActive: true,
    },
  });

  const bank2 = await prisma.wasteBank.create({
    data: {
      name: "Bank Sampah Mandiri Bersih",
      code: "BS-MLT-02",
      address: "Jl. Magelang KM 4.5, Sinduadi",
      phone: "081987654321",
      operatingHours: "Senin - Jumat (09:00 - 16:00 WIB)",
      regionId: region2.id,
      isActive: true,
    },
  });

  // 4. Harga Sampah per Bank Sampah
  await prisma.wastePrice.createMany({
    data: [
      { wasteBankId: bank1.id, wasteItemId: itemPet.id, pricePerKg: 4500 },
      { wasteBankId: bank1.id, wasteItemId: itemKardus.id, pricePerKg: 2800 },
      { wasteBankId: bank1.id, wasteItemId: itemHvs.id, pricePerKg: 3200 },
      { wasteBankId: bank1.id, wasteItemId: itemAlumunium.id, pricePerKg: 14000 },

      { wasteBankId: bank2.id, wasteItemId: itemPet.id, pricePerKg: 4200 },
      { wasteBankId: bank2.id, wasteItemId: itemKardus.id, pricePerKg: 3000 },
      { wasteBankId: bank2.id, wasteItemId: itemAlumunium.id, pricePerKg: 13500 },
    ],
  });

  // 5. User Roles (Demo Accounts)
  const citizenUser = await prisma.user.create({
    data: {
      email: "citizen@looop.id",
      passwordHash: "demo123",
      name: "Budi Santoso",
      phone: "081299991111",
      role: "CITIZEN",
    },
  });

  const bankAdminUser = await prisma.user.create({
    data: {
      email: "bank@looop.id",
      passwordHash: "demo123",
      name: "Siti Rahmawati (Admin Bank Sampah)",
      phone: "081288882222",
      role: "WASTE_BANK_ADMIN",
      wasteBankId: bank1.id,
    },
  });

  const govUser = await prisma.user.create({
    data: {
      email: "gov@slemankab.go.id",
      passwordHash: "demo123",
      name: "Dinas Lingkungan Hidup Kab. Sleman",
      phone: "0274888999",
      role: "GOVERNMENT",
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@looop.id",
      passwordHash: "demo123",
      name: "Super Administrator Looop",
      phone: "081100000000",
      role: "SUPER_ADMIN",
    },
  });

  // 6. User Balance Initial
  await prisma.userBalance.create({
    data: {
      userId: citizenUser.id,
      wasteBankId: bank1.id,
      available: 125000,
      held: 0,
    },
  });

  // 7. Dummy Sample Transactions & Inventory
  await prisma.inventoryItem.createMany({
    data: [
      { wasteBankId: bank1.id, wasteItemId: itemPet.id, stockKg: 145.5 },
      { wasteBankId: bank1.id, wasteItemId: itemKardus.id, stockKg: 320.0 },
      { wasteBankId: bank1.id, wasteItemId: itemAlumunium.id, stockKg: 42.0 },
    ],
  });

  const sampleDeposit = await prisma.deposit.create({
    data: {
      code: "LOO-DEP-000001",
      citizenId: citizenUser.id,
      wasteBankId: bank1.id,
      status: "COMPLETED",
      totalEstimated: 120000,
      totalActual: 125000,
      notes: "Kardus bekas kardus paket dan botol air mineral",
      weighingNotes: "Kardus kering dan botol sudah dibersihkan",
    },
  });

  await prisma.depositItem.createMany({
    data: [
      {
        depositId: sampleDeposit.id,
        wasteItemId: itemKardus.id,
        estimatedKg: 20,
        actualKg: 25,
        priceSnapshot: 2800,
        subtotal: 70000,
      },
      {
        depositId: sampleDeposit.id,
        wasteItemId: itemPet.id,
        estimatedKg: 10,
        actualKg: 12.2,
        priceSnapshot: 4500,
        subtotal: 55000,
      },
    ],
  });

  await prisma.ledgerEntry.create({
    data: {
      referenceNo: "LOO-TRX-000001",
      userId: citizenUser.id,
      wasteBankId: bank1.id,
      type: "CREDIT_DEPOSIT",
      amount: 125000,
      description: "Hasil penyetoran sampah LOO-DEP-000001",
      depositId: sampleDeposit.id,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
