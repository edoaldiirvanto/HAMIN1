import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function BankStaffPage() {
  const bank = await prisma.wasteBank.findFirst({
    where: { code: "BS-CTR-01" },
    include: {
      staff: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Manajemen Petugas & Pengelola Bank Sampah
        </h1>
        <p className="text-sm text-looop-muted">
          Daftar staf penimbang dan administrator yang berwenang dalam operasional unit bank sampah.
        </p>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-2">Petugas Berwenang</CardTitle>
        <CardDescription className="mb-4">
          Petugas memiliki akses untuk melakukan penimbangan fisik dan validasi transaksi setoran.
        </CardDescription>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">Nama Petugas</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">No. Telepon</th>
                <th className="py-3 px-4">Kewenangan / Peran</th>
                <th className="py-3 px-4">Terdaftar Sejak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {bank?.staff.map((st) => (
                <tr key={st.id} className="hover:bg-looop-bg/50">
                  <td className="py-3 px-4 font-bold text-looop-text">{st.name}</td>
                  <td className="py-3 px-4 text-looop-muted">{st.email}</td>
                  <td className="py-3 px-4 text-looop-muted">{st.phone || "-"}</td>
                  <td className="py-3 px-4">
                    <Badge variant="info">{st.role}</Badge>
                  </td>
                  <td className="py-3 px-4 text-looop-muted">{formatDate(st.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
