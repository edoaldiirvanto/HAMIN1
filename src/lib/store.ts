"use client";

import { useEffect, useState } from "react";
import { INITIAL_WASTE_BANKS, INITIAL_REGIONS, INITIAL_CITIZEN_USER } from "./static-data";

export interface DepositItemInput {
  id: string;
  wasteItemId: string;
  wasteItemName: string;
  unit: string;
  estimatedKg: number;
  actualKg: number;
  priceSnapshot: number;
  subtotal: number;
}

export interface DepositRecord {
  id: string;
  code: string;
  wasteBankId: string;
  wasteBankName: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  status: "SUBMITTED" | "ACCEPTED" | "WEIGHING" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
  totalEstimated: number;
  totalActual: number;
  items: DepositItemInput[];
}

export interface PayoutRecord {
  id: string;
  code: string;
  wasteBankId: string;
  wasteBankName: string;
  userId: string;
  userName: string;
  amount: number;
  method: "BANK_TRANSFER" | "CASH_PICKUP";
  accountDetails?: string; // bank name + rek, atau info jadwal
  notes?: string;
  pickupSchedule?: {
    location: string;
    date: string;
    timeSlot: string;
  };
  status: "REQUESTED" | "APPROVED" | "COMPLETED" | "REJECTED";
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CITIZEN" | "WASTE_BANK_ADMIN" | "WASTE_BANK_STAFF" | "GOVERNMENT" | "SUPER_ADMIN";
  wasteBankId?: string;
  address?: string;
  createdAt: string;
}

export interface WasteBankData {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  operatingHours: string;
  isActive: boolean;
  region: { id: string; regency: string; district: string; village: string };
  prices: {
    id: string;
    wasteItemId: string;
    pricePerKg: number;
    wasteItem: { id: string; name: string; unit: string; category?: { id: string; name: string } };
  }[];
  inventory: {
    id: string;
    wasteItemId: string;
    wasteItemName: string;
    categoryName: string;
    unit: string;
    stockKg: number;
    updatedAt: string;
  }[];
}

const STORAGE_KEY = "looop_app_central_state_v1";

interface AppState {
  users: UserAccount[];
  wasteBanks: WasteBankData[];
  deposits: DepositRecord[];
  payouts: PayoutRecord[];
  citizenBalances: {
    id: string;
    wasteBankId: string;
    wasteBankName: string;
    available: number;
    held: number;
  }[];
}

const INITIAL_STATE: AppState = {
  users: [
    {
      id: "user-citizen-1",
      name: "Budi Santoso",
      email: "citizen@looop.id",
      phone: "081234567890",
      role: "CITIZEN",
      createdAt: "2026-11-20T08:00:00.000Z",
    },
    {
      id: "user-bank-1",
      name: "Siti Rahayu (Admin Unit)",
      email: "bank@looop.id",
      phone: "081398765432",
      role: "WASTE_BANK_ADMIN",
      wasteBankId: "bank-1",
      createdAt: "2026-11-15T09:00:00.000Z",
    },
    {
      id: "user-staff-1",
      name: "Agus Pratama",
      email: "agus.staff@looop.id",
      phone: "081567891234",
      role: "WASTE_BANK_STAFF",
      wasteBankId: "bank-1",
      createdAt: "2026-11-18T10:00:00.000Z",
    },
    {
      id: "user-gov-1",
      name: "Dinas Lingkungan Hidup Kab. Sleman",
      email: "gov@slemankab.go.id",
      phone: "0274-868400",
      role: "GOVERNMENT",
      createdAt: "2026-11-01T08:00:00.000Z",
    },
    {
      id: "user-admin-1",
      name: "Super Administrator Looop",
      email: "admin@looop.id",
      phone: "08111222333",
      role: "SUPER_ADMIN",
      createdAt: "2026-10-01T08:00:00.000Z",
    },
  ],
  wasteBanks: [
    {
      id: "bank-1",
      name: "Bank Sampah Guyub Rukun",
      code: "BS-CTR-01",
      address: "Jl. Kaliurang KM 5.2, Caturtunggal, Depok",
      phone: "081234567890",
      operatingHours: "Senin - Sabtu: 08:00 - 15:00 WIB",
      isActive: true,
      region: INITIAL_REGIONS[0],
      prices: [
        {
          id: "p1",
          wasteItemId: "item-1",
          pricePerKg: 3500,
          wasteItem: { id: "item-1", name: "Botol PET Bening", unit: "kg", category: { id: "cat-1", name: "Plastik" } },
        },
        {
          id: "p2",
          wasteItemId: "item-2",
          pricePerKg: 1800,
          wasteItem: { id: "item-2", name: "Kardus Bekas Tebal", unit: "kg", category: { id: "cat-2", name: "Kertas & Kardus" } },
        },
        {
          id: "p3",
          wasteItemId: "item-3",
          pricePerKg: 12000,
          wasteItem: { id: "item-3", name: "Kaleng Minuman Alumunium", unit: "kg", category: { id: "cat-3", name: "Logam" } },
        },
      ],
      inventory: [
        {
          id: "inv-1",
          wasteItemId: "item-1",
          wasteItemName: "Botol PET Bening",
          categoryName: "Plastik",
          unit: "kg",
          stockKg: 145.5,
          updatedAt: "2026-11-26T14:30:00.000Z",
        },
        {
          id: "inv-2",
          wasteItemId: "item-2",
          wasteItemName: "Kardus Bekas Tebal",
          categoryName: "Kertas & Kardus",
          unit: "kg",
          stockKg: 320.0,
          updatedAt: "2026-11-26T15:00:00.000Z",
        },
        {
          id: "inv-3",
          wasteItemId: "item-3",
          wasteItemName: "Kaleng Minuman Alumunium",
          categoryName: "Logam",
          unit: "kg",
          stockKg: 42.0,
          updatedAt: "2026-11-25T11:20:00.000Z",
        },
      ],
    },
    {
      id: "bank-2",
      name: "Bank Sampah Berkah Resik",
      code: "BS-MLT-02",
      address: "Jl. Magelang KM 7.5, Sinduadi, Mlati",
      phone: "082345678901",
      operatingHours: "Selasa, Kamis, Sabtu: 09:00 - 16:00 WIB",
      isActive: true,
      region: INITIAL_REGIONS[1],
      prices: [
        {
          id: "p4",
          wasteItemId: "item-1",
          pricePerKg: 3600,
          wasteItem: { id: "item-1", name: "Botol PET Bening", unit: "kg", category: { id: "cat-1", name: "Plastik" } },
        },
        {
          id: "p5",
          wasteItemId: "item-2",
          pricePerKg: 1900,
          wasteItem: { id: "item-2", name: "Kardus Bekas Tebal", unit: "kg", category: { id: "cat-2", name: "Kertas & Kardus" } },
        },
      ],
      inventory: [
        {
          id: "inv-4",
          wasteItemId: "item-1",
          wasteItemName: "Botol PET Bening",
          categoryName: "Plastik",
          unit: "kg",
          stockKg: 85.0,
          updatedAt: "2026-11-25T10:00:00.000Z",
        },
        {
          id: "inv-5",
          wasteItemId: "item-2",
          wasteItemName: "Kardus Bekas Tebal",
          categoryName: "Kertas & Kardus",
          unit: "kg",
          stockKg: 102.5,
          updatedAt: "2026-11-26T12:00:00.000Z",
        },
      ],
    },
  ],
  deposits: [
    {
      id: "dep-1",
      code: "DEP-202611-001",
      wasteBankId: "bank-1",
      wasteBankName: "Bank Sampah Guyub Rukun",
      citizenId: "user-citizen-1",
      citizenName: "Budi Santoso",
      citizenPhone: "081234567890",
      status: "COMPLETED",
      notes: "Kardus rapi diikat, botol plastik bersih tanpa label",
      createdAt: "2026-11-26T10:30:00.000Z",
      totalEstimated: 35000,
      totalActual: 38500,
      items: [
        {
          id: "it-1",
          wasteItemId: "item-1",
          wasteItemName: "Botol PET Bening",
          unit: "kg",
          estimatedKg: 5.0,
          actualKg: 5.5,
          priceSnapshot: 3500,
          subtotal: 19250,
        },
        {
          id: "it-2",
          wasteItemId: "item-2",
          wasteItemName: "Kardus Bekas Tebal",
          unit: "kg",
          estimatedKg: 10.0,
          actualKg: 10.7,
          priceSnapshot: 1800,
          subtotal: 19250,
        },
      ],
    },
    {
      id: "dep-2",
      code: "DEP-202611-002",
      wasteBankId: "bank-1",
      wasteBankName: "Bank Sampah Guyub Rukun",
      citizenId: "user-citizen-1",
      citizenName: "Budi Santoso",
      citizenPhone: "081234567890",
      status: "WEIGHING",
      notes: "Penyetoran sore hari di posko 1",
      createdAt: "2026-11-27T08:15:00.000Z",
      totalEstimated: 24000,
      totalActual: 0,
      items: [
        {
          id: "it-3",
          wasteItemId: "item-3",
          wasteItemName: "Kaleng Minuman Alumunium",
          unit: "kg",
          estimatedKg: 2.0,
          actualKg: 0,
          priceSnapshot: 12000,
          subtotal: 24000,
        },
      ],
    },
  ],
  payouts: [
    {
      id: "pay-1",
      code: "PAY-202611-001",
      wasteBankId: "bank-1",
      wasteBankName: "Bank Sampah Guyub Rukun",
      userId: "user-citizen-1",
      userName: "Budi Santoso",
      amount: 50000,
      method: "BANK_TRANSFER",
      accountDetails: "Bank BCA - 1234567890 a.n. Budi Santoso",
      notes: "Pencairan rutin mingguan",
      status: "COMPLETED",
      createdAt: "2026-11-24T14:00:00.000Z",
    },
  ],
  citizenBalances: [
    {
      id: "bal-1",
      wasteBankId: "bank-1",
      wasteBankName: "Bank Sampah Guyub Rukun",
      available: 125000,
      held: 0,
    },
    {
      id: "bal-2",
      wasteBankId: "bank-2",
      wasteBankName: "Bank Sampah Berkah Resik",
      available: 45000,
      held: 0,
    },
  ],
};

function getStoredState(): AppState {
  if (typeof window === "undefined") {
    return INITIAL_STATE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
      return INITIAL_STATE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state: AppState) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event("looop_state_updated"));
    } catch (e) {
      console.error("Gagal simpan state:", e);
    }
  }
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setState(getStoredState());

    const handleUpdate = () => {
      setState(getStoredState());
    };

    window.addEventListener("looop_state_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("looop_state_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const addDeposit = (input: {
    wasteBankId: string;
    notes?: string;
    items: { wasteItemId: string; wasteItemName: string; unit: string; estimatedKg: number; priceSnapshot: number }[];
  }): DepositRecord => {
    const current = getStoredState();
    const bank = current.wasteBanks.find((b) => b.id === input.wasteBankId) || current.wasteBanks[0];
    const newCode = `DEP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(
      current.deposits.length + 1
    ).padStart(3, "0")}`;

    let totalEst = 0;
    const depositItems: DepositItemInput[] = input.items.map((it, idx) => {
      const subtotal = Math.round(it.estimatedKg * it.priceSnapshot);
      totalEst += subtotal;
      return {
        id: `it-${Date.now()}-${idx}`,
        wasteItemId: it.wasteItemId,
        wasteItemName: it.wasteItemName,
        unit: it.unit,
        estimatedKg: it.estimatedKg,
        actualKg: 0,
        priceSnapshot: it.priceSnapshot,
        subtotal,
      };
    });

    const newDeposit: DepositRecord = {
      id: `dep-${Date.now()}`,
      code: newCode,
      wasteBankId: bank.id,
      wasteBankName: bank.name,
      citizenId: "user-citizen-1",
      citizenName: "Budi Santoso",
      citizenPhone: "081234567890",
      status: "SUBMITTED",
      notes: input.notes || "",
      createdAt: new Date().toISOString(),
      totalEstimated: totalEst,
      totalActual: 0,
      items: depositItems,
    };

    const nextState: AppState = {
      ...current,
      deposits: [newDeposit, ...current.deposits],
    };

    saveState(nextState);
    return newDeposit;
  };

  const completeWeighing = (depositId: string, actualItems: { itemId: string; actualKg: number }[], notes?: string) => {
    const current = getStoredState();
    const depIndex = current.deposits.findIndex((d) => d.id === depositId);
    if (depIndex === -1) return null;

    const dep = current.deposits[depIndex];
    let totalActual = 0;

    const updatedItems = dep.items.map((it) => {
      const found = actualItems.find((a) => a.itemId === it.id);
      const actualKg = found !== undefined ? found.actualKg : it.estimatedKg;
      const subtotal = Math.round(actualKg * it.priceSnapshot);
      totalActual += subtotal;
      return {
        ...it,
        actualKg,
        subtotal,
      };
    });

    const updatedDeposit: DepositRecord = {
      ...dep,
      status: "COMPLETED",
      notes: notes || dep.notes,
      totalActual,
      items: updatedItems,
    };

    // Update saldo nasabah
    const updatedBalances = current.citizenBalances.map((bal) => {
      if (bal.wasteBankId === dep.wasteBankId) {
        return {
          ...bal,
          available: bal.available + totalActual,
        };
      }
      return bal;
    });

    // Update stok gudang bank sampah
    const updatedBanks = current.wasteBanks.map((b) => {
      if (b.id === dep.wasteBankId) {
        const newInv = [...b.inventory];
        updatedItems.forEach((it) => {
          const invIdx = newInv.findIndex((x) => x.wasteItemId === it.wasteItemId);
          if (invIdx !== -1) {
            newInv[invIdx] = {
              ...newInv[invIdx],
              stockKg: Number((newInv[invIdx].stockKg + it.actualKg).toFixed(1)),
              updatedAt: new Date().toISOString(),
            };
          }
        });
        return { ...b, inventory: newInv };
      }
      return b;
    });

    const nextDeposits = [...current.deposits];
    nextDeposits[depIndex] = updatedDeposit;

    const nextState: AppState = {
      ...current,
      deposits: nextDeposits,
      citizenBalances: updatedBalances,
      wasteBanks: updatedBanks,
    };

    saveState(nextState);
    return updatedDeposit;
  };

  const addPayout = (input: {
    wasteBankId: string;
    amount: number;
    method: "BANK_TRANSFER" | "CASH_PICKUP";
    accountDetails?: string;
    notes?: string;
    pickupSchedule?: { location: string; date: string; timeSlot: string };
  }): PayoutRecord | { error: string } => {
    const current = getStoredState();
    const balanceIdx = current.citizenBalances.findIndex((b) => b.wasteBankId === input.wasteBankId);

    if (balanceIdx === -1) {
      return { error: "Bank sampah tidak ditemukan dalam portofolio Anda" };
    }

    const currentBal = current.citizenBalances[balanceIdx];
    if (input.amount > currentBal.available) {
      return { error: "Nominal penarikan melebihi saldo tersedia" };
    }

    const bank = current.wasteBanks.find((b) => b.id === input.wasteBankId) || current.wasteBanks[0];
    const newCode = `PAY-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(
      current.payouts.length + 1
    ).padStart(3, "0")}`;

    const newPayout: PayoutRecord = {
      id: `pay-${Date.now()}`,
      code: newCode,
      wasteBankId: bank.id,
      wasteBankName: bank.name,
      userId: "user-citizen-1",
      userName: "Budi Santoso",
      amount: input.amount,
      method: input.method,
      accountDetails: input.accountDetails || "",
      notes: input.notes || "",
      pickupSchedule: input.pickupSchedule,
      status: "REQUESTED",
      createdAt: new Date().toISOString(),
    };

    // Alokasi saldo: pindahkan dari available ke held
    const nextBalances = [...current.citizenBalances];
    nextBalances[balanceIdx] = {
      ...currentBal,
      available: currentBal.available - input.amount,
      held: currentBal.held + input.amount,
    };

    const nextState: AppState = {
      ...current,
      payouts: [newPayout, ...current.payouts],
      citizenBalances: nextBalances,
    };

    saveState(nextState);
    return newPayout;
  };

  const processPayout = (payoutId: string, action: "APPROVE" | "REJECT") => {
    const current = getStoredState();
    const payIdx = current.payouts.findIndex((p) => p.id === payoutId);
    if (payIdx === -1) return null;

    const payout = current.payouts[payIdx];
    const balIdx = current.citizenBalances.findIndex((b) => b.wasteBankId === payout.wasteBankId);

    const nextBalances = [...current.citizenBalances];
    if (balIdx !== -1) {
      const bal = nextBalances[balIdx];
      if (action === "APPROVE") {
        // Selesai dicairkan: held berkurang
        nextBalances[balIdx] = {
          ...bal,
          held: Math.max(0, bal.held - payout.amount),
        };
      } else {
        // Ditolak: held kembali ke available
        nextBalances[balIdx] = {
          ...bal,
          available: bal.available + payout.amount,
          held: Math.max(0, bal.held - payout.amount),
        };
      }
    }

    const nextPayouts = [...current.payouts];
    nextPayouts[payIdx] = {
      ...payout,
      status: action === "APPROVE" ? "COMPLETED" : "REJECTED",
    };

    const nextState: AppState = {
      ...current,
      payouts: nextPayouts,
      citizenBalances: nextBalances,
    };

    saveState(nextState);
    return nextPayouts[payIdx];
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    phone: string;
    role: "CITIZEN" | "WASTE_BANK_ADMIN";
    bankName?: string;
    bankAddress?: string;
    district?: string;
    village?: string;
  }): { success: boolean; error?: string; user?: UserAccount } => {
    const current = getStoredState();
    if (current.users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk." };
    }

    let createdBankId: string | undefined;

    if (userData.role === "WASTE_BANK_ADMIN" && userData.bankName) {
      createdBankId = `bank-${Date.now()}`;
      const newBank: WasteBankData = {
        id: createdBankId,
        name: userData.bankName,
        code: `BS-${userData.district?.slice(0, 3).toUpperCase() || "SLM"}-${String(current.wasteBanks.length + 1).padStart(2, "0")}`,
        address: userData.bankAddress || "Alamat belum diatur",
        phone: userData.phone,
        operatingHours: "Senin - Sabtu: 08:30 - 15:00 WIB",
        isActive: true,
        region: {
          id: `reg-${Date.now()}`,
          regency: "Sleman",
          district: userData.district || "Depok",
          village: userData.village || "Caturtunggal",
        },
        prices: current.wasteBanks[0]?.prices || [],
        inventory: [
          {
            id: `inv-new-1`,
            wasteItemId: "item-1",
            wasteItemName: "Botol PET Bening",
            categoryName: "Plastik",
            unit: "kg",
            stockKg: 0,
            updatedAt: new Date().toISOString(),
          },
        ],
      };
      current.wasteBanks.push(newBank);
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      wasteBankId: createdBankId,
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [newUser, ...current.users];
    const nextState: AppState = {
      ...current,
      users: nextUsers,
      wasteBanks: current.wasteBanks,
    };

    saveState(nextState);
    return { success: true, user: newUser };
  };

  const updateWastePrice = (bankId: string, priceId: string, newPrice: number) => {
    const current = getStoredState();
    const bankIdx = current.wasteBanks.findIndex((b) => b.id === bankId);
    if (bankIdx === -1) return;

    const b = current.wasteBanks[bankIdx];
    const updatedPrices = b.prices.map((p) => (p.id === priceId ? { ...p, pricePerKg: newPrice } : p));

    const nextBanks = [...current.wasteBanks];
    nextBanks[bankIdx] = { ...b, prices: updatedPrices };

    saveState({ ...current, wasteBanks: nextBanks });
  };

  const addStaff = (bankId: string, staff: { name: string; email: string; phone: string; role: string }) => {
    const current = getStoredState();
    const newStaff: UserAccount = {
      id: `staff-${Date.now()}`,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: "WASTE_BANK_STAFF",
      wasteBankId: bankId,
      createdAt: new Date().toISOString(),
    };
    saveState({ ...current, users: [newStaff, ...current.users] });
  };

  const deleteUser = (userId: string) => {
    const current = getStoredState();
    const nextUsers = current.users.filter((u) => u.id !== userId);
    saveState({ ...current, users: nextUsers });
  };

  const toggleWasteBankStatus = (bankId: string) => {
    const current = getStoredState();
    const nextBanks = current.wasteBanks.map((b) =>
      b.id === bankId ? { ...b, isActive: !b.isActive } : b
    );
    saveState({ ...current, wasteBanks: nextBanks });
  };

  const addWasteBank = (data: { name: string; address: string; district?: string; village?: string; phone?: string }) => {
    const current = getStoredState();
    const newBankId = `bank-${Date.now()}`;
    const newBank: WasteBankData = {
      id: newBankId,
      name: data.name,
      code: `BS-${data.district?.slice(0, 3).toUpperCase() || "SLM"}-${String(current.wasteBanks.length + 1).padStart(2, "0")}`,
      address: data.address,
      phone: data.phone || "08123456789",
      operatingHours: "Senin - Sabtu: 08:00 - 15:00 WIB",
      isActive: true,
      region: {
        id: `reg-${Date.now()}`,
        regency: "Sleman",
        district: data.district || "Depok",
        village: data.village || "Caturtunggal",
      },
      prices: current.wasteBanks[0]?.prices || [],
      inventory: [
        {
          id: `inv-${Date.now()}-1`,
          wasteItemId: "item-1",
          wasteItemName: "Botol PET Bening",
          categoryName: "Plastik",
          unit: "kg",
          stockKg: 0,
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    saveState({ ...current, wasteBanks: [...current.wasteBanks, newBank] });
    return newBank;
  };

  return {
    state,
    mounted,
    addDeposit,
    completeWeighing,
    addPayout,
    processPayout,
    registerUser,
    updateWastePrice,
    addStaff,
    deleteUser,
    toggleWasteBankStatus,
    addWasteBank,
  };
}
