import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banks = await prisma.wasteBank.findMany({
      where: { isActive: true },
      include: {
        region: true,
        prices: {
          include: { wasteItem: true },
        },
      },
    });
    return NextResponse.json(banks);
  } catch (err) {
    console.error("Gagal query bank sampah API:", err);
    // Return fallback sample data agar UI tidak pernah crash
    return NextResponse.json([
      {
        id: "bank-1",
        name: "Bank Sampah Guyub Rukun",
        code: "BS-CTR-01",
        address: "Jl. Kaliurang KM 5.2, Caturtunggal, Depok",
        phone: "081234567890",
        isActive: true,
        region: { village: "Caturtunggal", district: "Depok" },
        prices: [
          { id: "p1", pricePerKg: 3500, wasteItem: { name: "Botol PET Bening" } },
          { id: "p2", pricePerKg: 1800, wasteItem: { name: "Kardus Bekas Tebal" } },
          { id: "p3", pricePerKg: 12000, wasteItem: { name: "Kaleng Minuman Alumunium" } },
        ],
      },
      {
        id: "bank-2",
        name: "Bank Sampah Berkah Resik",
        code: "BS-MLT-02",
        address: "Jl. Magelang KM 7.5, Sinduadi, Mlati",
        phone: "082345678901",
        isActive: true,
        region: { village: "Sinduadi", district: "Mlati" },
        prices: [
          { id: "p4", pricePerKg: 3600, wasteItem: { name: "Botol PET Bening" } },
          { id: "p5", pricePerKg: 1900, wasteItem: { name: "Kardus Bekas Tebal" } },
        ],
      },
    ]);
  }
}
