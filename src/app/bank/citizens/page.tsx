import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export const revalidate = 0;

export default async function BankCitizensPage() {
  const bank = await prisma.wasteBank.findFirst({
    where: { code: "BS-CTR-01" },
  });

  const balances = await prisma.userBalance.findMany({
    where: { wasteBankId: bank?.id },
    include: {
      user: {
        include: {
          deposits: { where: { wasteBankId: bank?.id } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Data Masyarakat & Nasabah Bank Sampah
        </h1>
        <p className="text-sm text-looop-muted">
          Daftar nasabah aktif yang memiliki saldo atau transaksi di bank sampah ini.
        </p>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-2">Nasabah Terdaftar ({balances.length} Warga)</CardTitle>
        <CardDescription className="mb-4">
          Keanggotaan bersifat opsional, seluruh warga penyetor tercatat secara transparan.
        </CardDescription>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-looop-bg text-looop-muted uppercase text-[10px] tracking-wider border-b border-looop-border">
              <tr>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Total Setoran</th>
                <th className="py-3 px-4">Saldo Tersedia</th>
                <th className="py-3 px-4">Saldo Tertahan</th>
                <th className="py-3 px-4">Status Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-looop-border">
              {balances.map((b) => (
                <tr key={b.id} className="hover:bg-looop-bg/50">
                  <td className="py-3 px-4 font-bold text-looop-text">{b.user.name}</td>
                  <td className="py-3 px-4 text-looop-muted">
                    <div>{b.user.email}</div>
                    <div className="text-[10px]">{b.user.phone || "-"}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-looop-text">
                    {b.user.deposits.length} kali transaksi
                  </td>
                  <td className="py-3 px-4 font-bold text-looop-secondary">
                    {formatRupiah(b.available)}
                  </td>
                  <td className="py-3 px-4 text-amber-600 font-semibold">
                    {formatRupiah(b.held)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Aktif Bertransaksi</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
