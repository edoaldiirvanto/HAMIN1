"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Building2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAppStore();

  const [role, setRole] = useState<"CITIZEN" | "WASTE_BANK_ADMIN">("CITIZEN");

  // Shared fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Bank Sampah fields
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [district, setDistrict] = useState("Depok");
  const [village, setVillage] = useState("Caturtunggal");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (role === "WASTE_BANK_ADMIN" && (!bankName.trim() || !bankAddress.trim())) {
      setErrorMsg("Nama Bank Sampah dan Alamat Operasional wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        bankName: role === "WASTE_BANK_ADMIN" ? bankName.trim() : undefined,
        bankAddress: role === "WASTE_BANK_ADMIN" ? bankAddress.trim() : undefined,
        district: role === "WASTE_BANK_ADMIN" ? district : undefined,
        village: role === "WASTE_BANK_ADMIN" ? village : undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Gagal melakukan pendaftaran akun.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          if (role === "CITIZEN") {
            router.push("/citizen");
          } else {
            router.push("/bank");
          }
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan internal pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-looop-bg">
      <div className="mb-6">
        <Logo size="lg" />
      </div>

      <Card className="w-full max-w-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <CardTitle className="text-xl sm:text-2xl mb-1">Daftar Akun Baru Looop</CardTitle>
          <CardDescription>
            Bergabunglah dengan ekosistem ekonomi sirkular digital Kabupaten Sleman
          </CardDescription>
        </div>

        {/* Role Selector Tabs (Phase 6.1 & 6.2) */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setRole("CITIZEN");
              setErrorMsg("");
            }}
            className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
              role === "CITIZEN"
                ? "border-looop-secondary bg-looop-accent/20 text-looop-primary font-bold shadow-sm"
                : "border-looop-border bg-white text-looop-muted hover:border-looop-secondary/40"
            }`}
          >
            <User className="w-5 h-5 text-looop-secondary flex-shrink-0" />
            <div>
              <div className="text-xs">Masyarakat (Warga)</div>
              <div className="text-[10px] font-normal opacity-80">Setor sampah & saldo</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("WASTE_BANK_ADMIN");
              setErrorMsg("");
            }}
            className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
              role === "WASTE_BANK_ADMIN"
                ? "border-looop-secondary bg-looop-accent/20 text-looop-primary font-bold shadow-sm"
                : "border-looop-border bg-white text-looop-muted hover:border-looop-secondary/40"
            }`}
          >
            <Building2 className="w-5 h-5 text-looop-primary flex-shrink-0" />
            <div>
              <div className="text-xs">Bank Sampah (Unit)</div>
              <div className="text-[10px] font-normal opacity-80">Kelola operasional & stok</div>
            </div>
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-looop-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-looop-text">Registrasi Berhasil!</h3>
            <p className="text-xs text-looop-muted max-w-sm mx-auto">
              Akun Anda sebagai <strong>{role === "CITIZEN" ? "Masyarakat" : "Pengelola Bank Sampah"}</strong> telah aktif.
            </p>
            <div className="text-[11px] text-looop-secondary font-semibold">
              Mengarahkan Anda langsung ke halaman dashboard...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="name"
                label={role === "CITIZEN" ? "Nama Lengkap" : "Nama Penanggung Jawab"}
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                id="phone"
                label="Nomor WhatsApp / HP"
                placeholder="Contoh: 081234567890"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <Input
              id="email"
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Khusus Role Bank Sampah */}
            {role === "WASTE_BANK_ADMIN" && (
              <div className="p-3.5 bg-looop-bg rounded-lg border border-looop-border space-y-3">
                <div className="text-xs font-bold text-looop-text flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-looop-secondary" />
                  <span>Informasi Unit Bank Sampah</span>
                </div>

                <Input
                  id="bankName"
                  label="Nama Unit Bank Sampah"
                  placeholder="Contoh: Bank Sampah Asri Mandiri"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />

                <Input
                  id="bankAddress"
                  label="Alamat Operasional Lengkap"
                  placeholder="Contoh: RT 03 / RW 12, Jl. Kaliurang KM 6"
                  value={bankAddress}
                  onChange={(e) => setBankAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-looop-text">Kecamatan</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-9 px-2 text-xs bg-white border border-looop-border rounded-button"
                    >
                      <option value="Depok">Depok</option>
                      <option value="Mlati">Mlati</option>
                      <option value="Ngaglik">Ngaglik</option>
                      <option value="Gamping">Gamping</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-looop-text">Desa / Kelurahan</label>
                    <select
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full h-9 px-2 text-xs bg-white border border-looop-border rounded-button"
                    >
                      <option value="Caturtunggal">Caturtunggal</option>
                      <option value="Sinduadi">Sinduadi</option>
                      <option value="Condongcatur">Condongcatur</option>
                      <option value="Maguwoharjo">Maguwoharjo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="password"
                label="Kata Sandi (min. 6 karakter)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                id="confirmPassword"
                label="Ulangi Kata Sandi"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
              className="w-full mt-2 font-bold text-xs h-10 gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <span>Daftar Sebagai {role === "CITIZEN" ? "Masyarakat" : "Bank Sampah"}</span>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-looop-muted pt-4 border-t border-looop-border">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="font-semibold text-looop-secondary hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </Card>
    </div>
  );
}
