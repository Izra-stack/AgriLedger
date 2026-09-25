import axios from 'axios';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from './firebase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return (async () => {
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      config.headers['Authorization'] = `Bearer ${await currentUser.getIdToken()}`;
      return config;
    }

  return config;
  })();
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      void signOut(firebaseAuth);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Adapter utilities to map DB schema to frontend expected schema
const mapFarmer = (f: any) => ({
  id: f.id,
  farmerCode: f.farmer_code,
  name: f.full_name || '',
  phone: f.phone || '',
  location: f.address || '',
  status: f.status === 'ACTIVE' ? 'Active' : 'Inactive',
  area: Number(f.area || 0),
  commitment: f.commitment === 'CASH_ASSISTANCE' ? 'Cash Assistance' : f.commitment === 'FARM_INPUT' ? 'Farm Input' : 'Both',
  notes: f.notes || '',
});

const mapInventory = (i: any) => ({
  id: i.id,
  sku: i.sku,
  name: i.name,
  category: i.category,
  stock: Number(i.quantity),
  reorderLevel: Number(i.reorder_level),
  price: Number(i.unit_cost),
  location: i.description || 'Warehouse',
});

const mapTransaction = (t: any) => ({
  id: t.id,
  transactionCode: t.transaction_code,
  date: t.transaction_date,
  farmerId: t.farmer_id,
  type: ({
    CASH_ASSISTANCE: 'Cash Advance',
    FERTILIZER: 'Fertilizer',
    MIXED_PACKAGE: 'Mixed Package',
    LABOR: 'Labor',
    SEEDS: 'Seeds',
    CHEMICALS: 'Chemicals',
  } as Record<string, string>)[t.type] || 'Other',
  description: t.description || '',
  paidAmount: Number(t.paid_amount || 0),
  amount: Number(t.amount),
  balance: Number(t.balance),
  status: t.status === 'PAID' ? 'Paid' : t.status === 'PARTIALLY_PAID' ? 'Partial' : 'Unpaid',
  farmerName: t.farmers ? t.farmers.full_name : undefined,
});

const mapPayment = (p: any) => ({
  id: p.id,
  paymentCode: p.payment_code,
  date: p.payment_date,
  transactionId: p.transaction_id,
  amount: Number(p.amount),
  notes: p.notes,
  farmerName: p.farmers ? p.farmers.full_name : undefined,
  txStatus: p.transactions?.status === 'PAID' ? 'Paid' : p.transactions?.status === 'PARTIALLY_PAID' ? 'Partial' : 'Unpaid',
  method: 'Cash',
  totalDue: Number(p.transactions?.amount ?? 0)
});

// Farmers API
export const getFarmers = async () => {
  const { data } = await api.get('/farmers');
  return data.data.map(mapFarmer);
};
export const getFarmer = async (id: string) => {
  const { data } = await api.get(`/farmers/${id}`);
  return mapFarmer(data.data);
};
export const createFarmer = async (payload: any) => {
  const { data } = await api.post('/farmers', payload);
  return mapFarmer(data.data);
};
export const updateFarmer = async ({ id, payload }: { id: string; payload: any }) => {
  const { data } = await api.put(`/farmers/${id}`, payload);
  return mapFarmer(data.data);
};
export const deleteFarmer = async (id: string) => (await api.delete(`/farmers/${id}`)).data;

// Inventory API
export const getInventory = async () => {
  const { data } = await api.get('/inventory');
  return data.data.map(mapInventory);
};
export const createInventoryItem = async (payload: any) => {
  const { data } = await api.post('/inventory', payload);
  return mapInventory(data.data);
};
export const updateInventoryItem = async ({ id, payload }: { id: string; payload: any }) => {
  const { data } = await api.put(`/inventory/${id}`, payload);
  return mapInventory(data.data);
};
export const deleteInventoryItem = async (id: string) => (await api.delete(`/inventory/${id}`)).data;

// Transactions API
export const getTransactions = async () => {
  const { data } = await api.get('/transactions');
  return data.data.map(mapTransaction);
};
export const createTransaction = async (payload: any) => {
  const { data } = await api.post('/transactions', payload);
  return mapTransaction(data.data);
};

// Payments API
export const getPayments = async () => {
  const { data } = await api.get('/payments');
  return data.data.map(mapPayment);
};
export const createPayment = async (payload: any) => {
  const { data } = await api.post('/payments', payload);
  return mapPayment(data.data);
};

// Dashboard API
export const getDashboardSummary = async () => (await api.get('/dashboard/summary')).data.data;
export const getDashboardAnalytics = async () => (await api.get('/dashboard/analytics')).data.data;

// Auth API
export const loginUser = async (payload: any) => {
  const { data } = await api.post('/auth/firebase-session', payload);
  return data.data;
};

// Settings API
const mapSettings = (s: any) => ({
  businessName: s.business_name || '',
  registrationNumber: s.registration_number || '',
  address: s.address || '',
  email: s.email || '',
  phone: s.phone || ''
});

export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return mapSettings(data.data);
};

export const updateSettings = async (payload: any) => {
  const { data } = await api.put('/settings', payload);
  return mapSettings(data.data);
};
