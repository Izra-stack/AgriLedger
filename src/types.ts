export type InventoryCategory = 'Fertilizer' | 'Seeds' | 'Chemicals' | 'Pesticides';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  stock: number;
  reorderLevel: number;
  price: number;
  location: string;
}

export interface Farmer {
  id: string;
  farmerCode: string;
  name: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive';
  area: number;
  commitment: 'Cash Assistance' | 'Farm Input' | 'Both';
  notes?: string;
}

export interface Transaction {
  id: string;
  transactionCode: string;
  date: string;
  farmerId: string;
  type: string;
  description: string;
  paidAmount: number;
  amount: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  farmerName?: string;
}

export interface Payment {
  id: string;
  paymentCode: string;
  date: string;
  transactionId: string;
  amount: number;
  notes?: string;
  farmerName?: string;
  txStatus: 'Paid' | 'Partial' | 'Unpaid';
  method: string;
  totalDue: number;
}

export interface DashboardSummary {
  totalLedgerValue: number;
  totalOutstanding: number;
  totalCollected: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  activeFarmers: number;
  totalCashAdvances: number;
  collectionRate: number;
}

export interface DashboardAnalytics {
  monthlyCollections: Array<{ month: string; amount: number }>;
  transactionTypesData: Array<{ name: string; value: number }>;
}

export interface BusinessSettings {
  businessName: string;
  registrationNumber: string;
  address: string;
  email: string;
  phone: string;
}
