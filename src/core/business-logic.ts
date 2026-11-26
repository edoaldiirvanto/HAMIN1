/**
 * Looop Business Logic
 * Sesuai PRD v1.1 Bagian 3.2, 3.3, 3.4, 7.3, & 7.4
 */

export interface WeighingItemInput {
  actualKg: number;
  pricePerKg: number;
}

export function calculateTransactionSubtotal(actualKg: number, pricePerKg: number): number {
  if (actualKg < 0 || pricePerKg < 0) {
    throw new Error("Berat aktual dan harga per satuan tidak boleh negatif.");
  }
  return Math.round(actualKg * pricePerKg);
}

export function calculateTotalTransaction(items: WeighingItemInput[]): number {
  return items.reduce((acc, item) => {
    return acc + calculateTransactionSubtotal(item.actualKg, item.pricePerKg);
  }, 0);
}

export interface BalanceState {
  available: number;
  held: number;
}

/**
 * Kredit saldo hasil setoran sampah yang sudah Completed
 */
export function applyDepositCompleted(
  currentBalance: BalanceState,
  transactionAmount: number
): BalanceState {
  if (transactionAmount <= 0) {
    throw new Error("Nominal setoran harus lebih besar dari 0.");
  }
  return {
    available: currentBalance.available + transactionAmount,
    held: currentBalance.held,
  };
}

/**
 * Tahan saldo ketika pencairan diajukan / disetujui (Payout Requested/Approved)
 */
export function holdPayoutAmount(
  currentBalance: BalanceState,
  payoutAmount: number
): BalanceState {
  if (payoutAmount <= 0) {
    throw new Error("Nominal pencairan harus lebih besar dari 0.");
  }
  if (currentBalance.available < payoutAmount) {
    throw new Error("Saldo tersedia tidak mencukupi untuk pencairan.");
  }
  return {
    available: currentBalance.available - payoutAmount,
    held: currentBalance.held + payoutAmount,
  };
}

/**
 * Saldo tertahan dilepaskan permanen setelah pencairan dinyatakan Paid
 */
export function releaseHeldPayout(
  currentBalance: BalanceState,
  payoutAmount: number
): BalanceState {
  if (currentBalance.held < payoutAmount) {
    throw new Error("Saldo tertahan tidak mencukupi.");
  }
  return {
    available: currentBalance.available,
    held: currentBalance.held - payoutAmount,
  };
}

/**
 * Saldo tertahan dikembalikan jika pencairan dibatalkan atau ditolak (Failed/Rejected)
 */
export function refundHeldPayout(
  currentBalance: BalanceState,
  payoutAmount: number
): BalanceState {
  if (currentBalance.held < payoutAmount) {
    throw new Error("Saldo tertahan tidak mencukupi untuk dikembalikan.");
  }
  return {
    available: currentBalance.available + payoutAmount,
    held: currentBalance.held - payoutAmount,
  };
}
