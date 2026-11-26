import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
}
