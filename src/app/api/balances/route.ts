import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const citizen = await prisma.user.findFirst({
    where: { role: "CITIZEN" },
  });
  if (!citizen) return NextResponse.json([]);

  const balances = await prisma.userBalance.findMany({
    where: { userId: citizen.id },
    include: { wasteBank: true },
  });
  return NextResponse.json(balances);
}
