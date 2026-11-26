import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wasteBankId, notes, items } = body;

    const citizen = await prisma.user.findFirst({
      where: { role: "CITIZEN" },
    });
    if (!citizen) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const count = await prisma.deposit.count();
    const code = `LOO-DEP-${String(count + 1).padStart(6, "0")}`;

    // Ambil harga snapshot per jenis sampah
    const prices = await prisma.wastePrice.findMany({
      where: { wasteBankId },
    });
    const priceMap = new Map<string, number>(prices.map((p: any) => [p.wasteItemId, p.pricePerKg]));

    let totalEstimated = 0;
    const depositItemsData = items.map((item: { wasteItemId: string; estimatedKg: number }) => {
      const price = Number(priceMap.get(item.wasteItemId) || 0);
      const subtotal = Math.round(item.estimatedKg * price);
      totalEstimated += subtotal;
      return {
        wasteItemId: item.wasteItemId,
        estimatedKg: item.estimatedKg,
        priceSnapshot: price,
        subtotal,
      };
    });

    const newDeposit = await prisma.deposit.create({
      data: {
        code,
        citizenId: citizen.id,
        wasteBankId,
        notes,
        totalEstimated,
        status: "SUBMITTED",
        items: {
          create: depositItemsData,
        },
      },
      include: { items: true },
    });

    return NextResponse.json(newDeposit);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
