"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export default function BankCitizensPage() {
  const { state, mounted } = useAppStore();

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-looop-muted">Memuat data nasabah...</div>;
  }

  const currentBank = state.wasteBanks[0];
  const deposits = state.deposits.filter((d) => d.wasteBankId === currentBank.id);
  const balances = state.citizenBalances.filter((b) => b.wasteBankId === currentBank.id);

  // Warga yang memiliki relasi saldo/setoran
  const citizenUsers = state.users.filter((u) => u.role === "CITIZEN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-looop-text tracking-tight">
          Data Masyarakat & Nasabah Bank Sampah
        </h1>
        <p className="text-sm text-looop-muted">
          Daftar nasabah aktif yang memiliki saldo atau riwayat transaksi di {currentBank.name}.
        </p>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-2">Nasabah Terdaftar ({citizenUsers.length} Warga)</CardTitle>
        <CardDescription className="mb-4">
          Keanggotaan bersifat fleksibel, seluruh warga penyetor tercatat secara transparan di buku besar.
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
              {citizenUsers.map((u) => {
                const userDeposits = deposits.filter((d) => d.citizenId === u.id);
                const userBalance = balances.find((b) => b.wasteBankId === currentBank.id) || {
                  available: 0,
                  held: 0,
                };

                return (
                  <tr key={u.id} className="hover:bg-looop-bg/50 transition">
                    <td className="py-3 px-4 font-bold text-looop-text">{u.name}</td>
                    <td className="py-3 px-4 text-looop-muted">
                      <div>{u.email}</div>
                      <div className="text-[10px]">{u.phone || "-"}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-looop-secondary">
                      {userDeposits.length} kali transaksi
                    </td>
                    <td className="py-3 px-4 font-extrabold text-looop-primary font-mono">
                      {formatRupiah(userBalance.available)}
                    </td>
                    <td className="py-3 px-4 text-amber-600 font-mono font-medium">
                      {formatRupiah(userBalance.held)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-looop-success border border-emerald-200">
                        Aktif
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
