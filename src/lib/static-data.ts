export interface MockRegion {
  id: string;
  regency: string;
  district: string;
  village: string;
}

export interface MockPrice {
  id: string;
  pricePerKg: number;
  wasteItem: {
    id: string;
    name: string;
    unit: string;
    category?: { name: string };
  };
}

export interface MockWasteBank {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  operatingHours: string;
  isActive: boolean;
  region: MockRegion;
  prices: MockPrice[];
}

export const INITIAL_REGIONS: MockRegion[] = [
  { id: "reg-1", regency: "Sleman", district: "Depok", village: "Caturtunggal" },
  { id: "reg-2", regency: "Sleman", district: "Mlati", village: "Sinduadi" },
];

export const INITIAL_WASTE_BANKS: MockWasteBank[] = [
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
      { id: "p1", pricePerKg: 3500, wasteItem: { id: "item-1", name: "Botol PET Bening", unit: "kg" } },
      { id: "p2", pricePerKg: 1800, wasteItem: { id: "item-2", name: "Kardus Bekas Tebal", unit: "kg" } },
      { id: "p3", pricePerKg: 12000, wasteItem: { id: "item-3", name: "Kaleng Minuman Alumunium", unit: "kg" } },
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
      { id: "p4", pricePerKg: 3600, wasteItem: { id: "item-1", name: "Botol PET Bening", unit: "kg" } },
      { id: "p5", pricePerKg: 1900, wasteItem: { id: "item-2", name: "Kardus Bekas Tebal", unit: "kg" } },
    ],
  },
];

export const INITIAL_CITIZEN_USER = {
  id: "user-citizen-1",
  name: "Budi Santoso",
  email: "warga@looop.id",
  role: "CITIZEN",
  balances: [
    {
      id: "bal-1",
      wasteBankId: "bank-1",
      available: 125000,
      held: 0,
      wasteBank: { name: "Bank Sampah Guyub Rukun" },
    },
    {
      id: "bal-2",
      wasteBankId: "bank-2",
      available: 45000,
      held: 15000,
      wasteBank: { name: "Bank Sampah Berkah Resik" },
    },
  ],
  deposits: [
    {
      id: "dep-1",
      code: "DEP-202611-001",
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      totalActual: 38500,
      totalEstimated: 35000,
      wasteBank: { name: "Bank Sampah Guyub Rukun" },
    },
    {
      id: "dep-2",
      code: "DEP-202611-002",
      status: "WEIGHING",
      createdAt: new Date().toISOString(),
      totalActual: 0,
      totalEstimated: 18000,
      wasteBank: { name: "Bank Sampah Berkah Resik" },
    },
  ],
};
