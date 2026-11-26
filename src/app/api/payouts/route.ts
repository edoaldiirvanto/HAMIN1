import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { holdPayoutAmount } from "@/core/business-logic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wasteBankId, amount, method, accountDetails } = body;

    const citizen = await prisma.user.findFirst({
      where: { role: "CITIZEN" },
    });
    if (!citizen) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const balance = await prisma.userBalance.findUnique({
      where: {
        userId_wasteBankId: {
          userId: citizen.id,
          wasteBankId,
        },
      },
    });

    if (!balance || balance.available < amount) {
      return NextResponse.json(
        { error: "Saldo tersedia tidak mencukupi untuk pencairan." },
        { status: 400 }
      );
    }

    // Terapkan aturan saldo Looop (hold payout)
    const newBalance = holdPayoutAmount(
      { available: balance.available, held: balance.held },
      amount
    );

    const count = await prisma.payout.count();
    const code = `LOO-PAY-${String(count + 1).padStart(6, "0")}`;

    // Update saldo dan buat record payout secara transaksional
    const payout = await prisma.$transaction(async (tx) => {
      await tx.userBalance.update({
        where: { id: balance.id },
        data: {
          available: newBalance.available,
          held: newBalance.held,
        },
      });

      const p = await tx.payout.create({
        data: {
          code,
          userId: citizen.id,
          wasteBankId,
          amount,
          method,
          accountDetails,
          status: "REQUESTED",
        },
      });

      await tx.ledgerEntry.create({
        data: {
          referenceNo: `LOO-TRX-H${String(count + 1).padStart(5, "0")}`,
          userId: citizen.id,
          wasteBankId,
          type: "DEBIT_PAYOUT_HOLD",
          amount,
          description: `Penahanan saldo untuk pengajuan pencairan ${code}`,
          payoutId: p.id,
        },
      });

      return p;
    });

    return NextResponse.json(payout);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
