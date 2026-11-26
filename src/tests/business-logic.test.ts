import { describe, it, expect } from "vitest";
import {
  calculateTransactionSubtotal,
  calculateTotalTransaction,
  applyDepositCompleted,
  holdPayoutAmount,
  releaseHeldPayout,
  refundHeldPayout,
} from "../core/business-logic";

describe("Looop Business Logic & Financial Ledger", () => {
  describe("Kalkulasi Penimbangan (Weighing Math)", () => {
    it("menghitung subtotal = berat aktual x harga snapshot", () => {
      const subtotal = calculateTransactionSubtotal(12.5, 5000);
      expect(subtotal).toBe(62500);
    });

    it("menolak berat atau harga negatif", () => {
      expect(() => calculateTransactionSubtotal(-2, 5000)).toThrow();
      expect(() => calculateTransactionSubtotal(2, -5000)).toThrow();
    });

    it("menghitung total akumulasi beberapa item sampah", () => {
      const total = calculateTotalTransaction([
        { actualKg: 5, pricePerKg: 3000 },  // 15.000
        { actualKg: 2.5, pricePerKg: 7000 }, // 17.500
      ]);
      expect(total).toBe(32500);
    });
  });

  describe("Aturan Saldo Digital (Digital Ledger & Payout)", () => {
    const initialBalance = { available: 50000, held: 0 };

    it("menambah saldo tersedia saat setoran sampah berstatus COMPLETED", () => {
      const updated = applyDepositCompleted(initialBalance, 30000);
      expect(updated.available).toBe(80000);
      expect(updated.held).toBe(0);
    });

    it("menahan saldo saat pencairan diajukan", () => {
      const heldState = holdPayoutAmount(initialBalance, 25000);
      expect(heldState.available).toBe(25000);
      expect(heldState.held).toBe(25000);
    });

    it("menolak pencairan jika saldo tersedia tidak mencukupi", () => {
      expect(() => holdPayoutAmount(initialBalance, 60000)).toThrow(
        "Saldo tersedia tidak mencukupi untuk pencairan."
      );
    });

    it("melepaskan saldo tertahan saat pembayaran berhasil (PAID)", () => {
      const heldState = { available: 25000, held: 25000 };
      const paidState = releaseHeldPayout(heldState, 25000);
      expect(paidState.available).toBe(25000);
      expect(paidState.held).toBe(0);
    });

    it("mengembalikan saldo tertahan ke saldo tersedia saat pencairan gagal/ditolak", () => {
      const heldState = { available: 25000, held: 25000 };
      const refunded = refundHeldPayout(heldState, 25000);
      expect(refunded.available).toBe(50000);
      expect(refunded.held).toBe(0);
    });
  });
});
