import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bank = await prisma.wasteBank.findFirst({
    where: { code: "BS-CTR-01" },
  });
  if (!bank) return NextResponse.json([]);

  const deposits = await prisma.deposit.findMany({
    where: { wasteBankId: bank.id },
    orderBy: { createdAt: "desc" },
    include: {
      citizen: true,
      items: {
        include: { wasteItem: true },
      },
    },
  });

  return NextResponse.json(deposits);
}
