import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { regency, district, village } = body;

    if (!regency || !district || !village) {
      return NextResponse.json({ error: "Seluruh atribut wilayah wajib diisi" }, { status: 400 });
    }

    const newRegion = await prisma.region.create({
      data: { regency, district, village },
    });

    return NextResponse.json(newRegion);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
