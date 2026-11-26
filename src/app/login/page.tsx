"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, User, Building2, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("citizen@looop.id");
  const [password, setPassword] = useState("demo123");

  const handleRoleSelect = (roleEmail: string, route: string) => {
    setEmail(roleEmail);
    router.push(route);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("gov")) {
      router.push("/government");
    } else if (email.includes("bank")) {
      router.push("/bank");
    } else if (email.includes("admin")) {
      router.push("/admin");
    } else {
      router.push("/citizen");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-looop-bg">
      <div className="mb-6">
        <Logo size="lg" />
      </div>

      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <CardTitle className="text-xl sm:text-2xl mb-1">Masuk ke Akun Looop</CardTitle>
          <CardDescription>
            Pilih role atau masukkan kredensial untuk masuk ke dashboard
          </CardDescription>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mb-6 pb-6 border-b border-looop-border">
          <label className="block text-xs font-semibold text-looop-muted mb-2 text-center">
            Masuk Cepat Sebagai:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect("citizen@looop.id", "/citizen")}
              className="flex items-center gap-2 p-2.5 rounded-button border border-looop-border bg-looop-bg/60 hover:bg-looop-bg text-left transition"
            >
              <User className="w-4 h-4 text-looop-secondary flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-looop-text">Masyarakat</div>
                <div className="text-[10px] text-looop-muted">citizen@looop.id</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("bank@looop.id", "/bank")}
              className="flex items-center gap-2 p-2.5 rounded-button border border-looop-border bg-looop-bg/60 hover:bg-looop-bg text-left transition"
            >
              <Building2 className="w-4 h-4 text-looop-primary flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-looop-text">Bank Sampah</div>
                <div className="text-[10px] text-looop-muted">bank@looop.id</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("gov@slemankab.go.id", "/government")}
              className="flex items-center gap-2 p-2.5 rounded-button border border-looop-border bg-looop-bg/60 hover:bg-looop-bg text-left transition"
            >
              <TrendingUp className="w-4 h-4 text-looop-info flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-looop-text">Pemerintah</div>
                <div className="text-[10px] text-looop-muted">gov@slemankab.go.id</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("admin@looop.id", "/admin")}
              className="flex items-center gap-2 p-2.5 rounded-button border border-looop-border bg-looop-bg/60 hover:bg-looop-bg text-left transition"
            >
              <Shield className="w-4 h-4 text-looop-text flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-looop-text">Super Admin</div>
                <div className="text-[10px] text-looop-muted">admin@looop.id</div>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            id="email"
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            label="Kata Sandi"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="secondary" className="w-full mt-2">
            Masuk
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-looop-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-looop-secondary hover:underline">
            Daftar sebagai Masyarakat
          </Link>
        </div>
      </Card>
    </div>
  );
}
