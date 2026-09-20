import { create } from 'zustand';

export type FarmerStatus = 'Active' | 'Inactive';
export type TransactionType = 'Fertilizer' | 'Cash Advance' | 'Mixed Package' | 'Labor' | 'Seeds' | 'Chemicals';
export type TransactionStatus = 'Paid' | 'Partial' | 'Unpaid';
export type InventoryStatus = 'Good' | 'Low Stock' | 'Critical';
export type InventoryCategory = 'Fertilizer' | 'Seeds' | 'Chemicals' | 'Equipment';

export interface Farmer {
  id: string; // e.g., FRM-001
  name: string;
  phone: string;
  location: string;
  status: FarmerStatus;
  area: number;
  commitment: 'Cash Assistance' | 'Farm Input' | 'Both';
  notes?: string;
}

export interface Transaction {
  id: string; // e.g., TRX-1029
  date: string;
  farmerId: string;
  type: TransactionType;
  amount: number;
  balance: number;
  status: TransactionStatus;
  notes?: string;
}

export interface Payment {
  id: string; // e.g., PAY-001
  date: string;
  transactionId: string;
  amount: number;
  notes?: string;
}

export interface InventoryItem {
  id: string; // e.g., FERT-001
  name: string;
  category: InventoryCategory;
  stock: number;
  reorderLevel: number;
  price: number;
  location: string;
}

export interface Settings {
  businessName: string;
  registrationNumber: string;
  address: string;
  email: string;
  phone: string;
}

interface StoreState {
  farmers: Farmer[];
  transactions: Transaction[];
  payments: Payment[];
  inventory: InventoryItem[];
  settings: Settings;

  // Actions
  addFarmer: (farmer: Omit<Farmer, 'id'>) => void;
  updateFarmer: (id: string, farmer: Partial<Farmer>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'balance' | 'status'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

// Initial Mock Data
const initialFarmers: Farmer[] = [
  { id: 'FRM-001', name: 'Jose Mendoza', phone: '+63 917 123 4567', location: 'Brgy. Tibal-og, Santo Tomas', status: 'Active', area: 2.5, commitment: 'Both' },
  { id: 'FRM-002', name: 'Rodolfo Cruz', phone: '+63 918 234 5678', location: 'Brgy. Bobon, Santo Tomas', status: 'Active', area: 3.0, commitment: 'Farm Input' },
  { id: 'FRM-003', name: 'Gloria Pangilinan', phone: '+63 919 345 6789', location: 'Brgy. San Miguel, Santo Tomas', status: 'Inactive', area: 1.8, commitment: 'Cash Assistance' },
  { id: 'FRM-004', name: 'Vicente O. Magsaysay', phone: '+63 920 456 7890', location: 'Brgy. Tibal-og, Santo Tomas', status: 'Active', area: 4.2, commitment: 'Both' },
];

const initialTransactions: Transaction[] = [
  { id: 'TRX-1029', date: '2024-10-23T16:10:00Z', farmerId: 'FRM-001', type: 'Fertilizer', amount: 12000, balance: 0, status: 'Paid' },
  { id: 'TRX-1030', date: '2024-10-23T14:30:00Z', farmerId: 'FRM-002', type: 'Cash Advance', amount: 19000, balance: 10000, status: 'Partial' },
  { id: 'TRX-1031', date: '2024-10-22T09:15:00Z', farmerId: 'FRM-004', type: 'Mixed Package', amount: 32000, balance: 32000, status: 'Unpaid' },
  { id: 'TRX-1032', date: '2024-10-22T08:00:00Z', farmerId: 'FRM-002', type: 'Fertilizer', amount: 8500, balance: 0, status: 'Paid' },
  { id: 'TRX-0915', date: '2024-09-05T10:00:00Z', farmerId: 'FRM-001', type: 'Labor', amount: 10000, balance: 0, status: 'Paid' },
];

const initialPayments: Payment[] = [
  { id: 'PAY-001', date: '2024-10-24T09:20:00Z', transactionId: 'TRX-1029', amount: 12000 },
  { id: 'PAY-002', date: '2024-10-24T10:15:00Z', transactionId: 'TRX-1030', amount: 9000 },
  { id: 'PAY-003', date: '2024-10-24T11:00:00Z', transactionId: 'TRX-1032', amount: 8500 },
  { id: 'PAY-004', date: '2024-10-01T10:00:00Z', transactionId: 'TRX-0915', amount: 10000 },
];

const initialInventory: InventoryItem[] = [
  { id: 'FERT-001', name: 'Urea (46-0-0) Pellets', category: 'Fertilizer', stock: 14, reorderLevel: 50, price: 1200, location: 'Warehouse A' },
  { id: 'FERT-002', name: 'Complete 14-14-14', category: 'Fertilizer', stock: 22, reorderLevel: 50, price: 1500, location: 'Warehouse A' },
  { id: 'FERT-003', name: 'Muriate of Potash', category: 'Fertilizer', stock: 85, reorderLevel: 50, price: 1100, location: 'Warehouse B' },
];

const initialSettings: Settings = {
  businessName: 'AgriLedger Cooperative',
  registrationNumber: 'CDA-9921-2023',
  address: 'Santo Tomas, Davao del Norte',
  email: 'admin@agriledger.ph',
  phone: '+63 999 999 9999'
};

export const useStore = create<StoreState>((set) => ({
  farmers: initialFarmers,
  transactions: initialTransactions,
  payments: initialPayments,
  inventory: initialInventory,
  settings: initialSettings,

  addFarmer: (farmer) => set((state) => {
    const newId = `FRM-${String(state.farmers.length + 1).padStart(3, '0')}`;
    return { farmers: [{ ...farmer, id: newId }, ...state.farmers] };
  }),

  updateFarmer: (id, updatedFields) => set((state) => ({
    farmers: state.farmers.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
  })),

  addTransaction: (tx) => set((state) => {
    const newId = `TRX-${1033 + state.transactions.length}`;
    const newTx: Transaction = {
      ...tx,
      id: newId,
      balance: tx.amount,
      status: 'Unpaid'
    };
    return { transactions: [newTx, ...state.transactions] };
  }),

  updateTransaction: (id, updatedFields) => set((state) => {
    return {
      transactions: state.transactions.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updatedFields };
        // Recalculate status if balance changed
        if (updatedFields.balance !== undefined) {
           updated.status = updated.balance <= 0 ? 'Paid' : updated.balance < updated.amount ? 'Partial' : 'Unpaid';
        }
        return updated;
      })
    };
  }),

  addPayment: (payment) => set((state) => {
    const newId = `PAY-${String(state.payments.length + 1).padStart(3, '0')}`;
    
    // Also update transaction balance
    const tx = state.transactions.find(t => t.id === payment.transactionId);
    if (tx) {
      const newBalance = Math.max(0, tx.balance - payment.amount);
      const newStatus: TransactionStatus = newBalance <= 0 ? 'Paid' : newBalance < tx.amount ? 'Partial' : 'Unpaid';
      
      const updatedTx = state.transactions.map(t => 
        t.id === payment.transactionId ? { ...t, balance: newBalance, status: newStatus } : t
      );
      
      return { 
        payments: [{ ...payment, id: newId }, ...state.payments],
        transactions: updatedTx
      };
    }

    return { payments: [{ ...payment, id: newId }, ...state.payments] };
  }),

  addInventoryItem: (item) => set((state) => {
    const prefix = item.category === 'Fertilizer' ? 'FERT' : item.category === 'Seeds' ? 'SEED' : 'ITEM';
    const newId = `${prefix}-${String(state.inventory.length + 1).padStart(3, '0')}`;
    return { inventory: [{ ...item, id: newId }, ...state.inventory] };
  }),

  updateInventoryItem: (id, updatedFields) => set((state) => ({
    inventory: state.inventory.map((i) => (i.id === id ? { ...i, ...updatedFields } : i))
  })),

  deleteInventoryItem: (id) => set((state) => ({
    inventory: state.inventory.filter((i) => i.id !== id)
  })),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  }))
}));
