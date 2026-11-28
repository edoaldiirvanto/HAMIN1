import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyDepositCompleted } from "@/core/business-logic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depositId, status, weighingNotes, items } = body;

    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: { items: true, citizen: true },
    });

    if (!deposit) {
      return NextResponse.json({ error: "Deposit tidak ditemukan" }, { status: 404 });
    }

    // IDEMPOTENCY CHECK: Jika deposit sudah COMPLETED atau sudah ada ledger kredit, tolak proses ulang
    if (deposit.status === "COMPLETED") {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        message: "Transaksi penimbangan ini sudah selesai dan tidak dapat diproses ulang.",
        totalActual: deposit.totalActual,
      });
    }

    const existingLedger = await prisma.ledgerEntry.findFirst({
      where: { depositId: deposit.id, type: "CREDIT_DEPOSIT" },
    });

    if (existingLedger) {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        message: "Kredit saldo untuk transaksi ini telah dicatat sebelumnya.",
        totalActual: deposit.totalActual,
      });
    }

    let calculatedTotalActual = 0;

    await prisma.$transaction(async (tx: any) => {
      // 1. Update bobot aktual tiap item
      for (const it of items) {
        const existing = deposit.items.find((x: any) => x.id === it.id);
        if (existing) {
          const subtotal = Math.round(it.actualKg * existing.priceSnapshot);
          calculatedTotalActual += subtotal;

          await tx.depositItem.update({
            where: { id: it.id },
            data: {
              actualKg: it.actualKg,
              subtotal,
            },
          });

          // Jika status selesai, update persediaan bank sampah (stok bertambah)
          if (status === "COMPLETED") {
            await tx.inventoryItem.upsert({
              where: {
                wasteBankId_wasteItemId: {
                  wasteBankId: deposit.wasteBankId,
                  wasteItemId: existing.wasteItemId,
                },
              },
              update: {
                stockKg: { increment: it.actualKg },
              },
              create: {
                wasteBankId: deposit.wasteBankId,
                wasteItemId: existing.wasteItemId,
                stockKg: it.actualKg,
              },
            });
          }
        }
      }

      // 2. Update status deposit
      await tx.deposit.update({
        where: { id: deposit.id },
        data: {
          status,
          weighingNotes,
          totalActual: calculatedTotalActual,
        },
      });

      // 3. Jika status COMPLETED: update saldo user & catat ke ledger
      if (status === "COMPLETED" && calculatedTotalActual > 0) {
        const balance = await tx.userBalance.findUnique({
          where: {
            userId_wasteBankId: {
              userId: deposit.citizenId,
              wasteBankId: deposit.wasteBankId,
            },
          },
        });

        const currentAvailable = balance ? balance.available : 0;
        const currentHeld = balance ? balance.held : 0;

        const newBalance = applyDepositCompleted(
          { available: currentAvailable, held: currentHeld },
          calculatedTotalActual
        );

        await tx.userBalance.upsert({
          where: {
            userId_wasteBankId: {
              userId: deposit.citizenId,
              wasteBankId: deposit.wasteBankId,
            },
          },
          update: {
            available: newBalance.available,
          },
          create: {
            userId: deposit.citizenId,
            wasteBankId: deposit.wasteBankId,
            available: newBalance.available,
            held: 0,
          },
        });

        const trxCount = await tx.ledgerEntry.count();
        await tx.ledgerEntry.create({
          data: {
            referenceNo: `LOO-TRX-${String(trxCount + 1).padStart(6, "0")}`,
            userId: deposit.citizenId,
            wasteBankId: deposit.wasteBankId,
            type: "CREDIT_DEPOSIT",
            amount: calculatedTotalActual,
            description: `Kredit hasil penimbangan transaksi ${deposit.code}`,
            depositId: deposit.id,
          },
        });
      }
    });

    return NextResponse.json({ success: true, totalActual: calculatedTotalActual });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
