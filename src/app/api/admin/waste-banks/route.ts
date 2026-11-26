import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, phone, operatingHours, regionId } = body;

    if (!name || !regionId) {
      return NextResponse.json({ error: "Nama dan wilayah wajib diisi" }, { status: 400 });
    }

    const count = await prisma.wasteBank.count();
    const code = `BS-NEW-${String(count + 1).padStart(2, "0")}`;

    const newBank = await prisma.wasteBank.create({
      data: {
        name,
        code,
        address: address || "Alamat operasional belum diatur",
        phone,
        operatingHours: operatingHours || "Senin - Sabtu (08:00 - 15:00 WIB)",
        regionId,
        isActive: true,
      },
      include: { region: true },
    });

    return NextResponse.json(newBank);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isActive } = body;

    const updated = await prisma.wasteBank.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
