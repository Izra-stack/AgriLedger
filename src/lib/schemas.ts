import * as z from 'zod';

export const farmerSchema = z.object({
  name: z.string().min(2, 'Full Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  location: z.string().min(5, 'Address is required'),
  status: z.enum(['Active', 'Inactive']),
  area: z.coerce.number().min(0.1, 'Area must be at least 0.1'),
  commitment: z.enum(['Cash Assistance', 'Farm Input', 'Both']),
  notes: z.string().optional(),
});

export const transactionSchema = z.object({
  farmerId: z.string().min(1, 'Please select a farmer'),
  type: z.enum(['Fertilizer', 'Cash Advance', 'Mixed Package', 'Labor', 'Seeds', 'Chemicals']),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  farmerId: z.string().min(1, 'Please select a farmer'),
  transactionId: z.string().min(1, 'Please select a transaction'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Payment date is required'),
  notes: z.string().optional(),
});

export const inventorySchema = z.object({
  name: z.string().min(2, 'Item Name is required'),
  category: z.enum(['Fertilizer', 'Seeds', 'Chemicals', 'Equipment']),
  stock: z.coerce.number().min(0, 'Initial Stock cannot be negative'),
  reorderLevel: z.coerce.number().min(0, 'Reorder Level cannot be negative'),
  price: z.coerce.number().min(0, 'Unit Price cannot be negative'),
  location: z.string().min(2, 'Storage Location is required'),
});

export const settingsSchema = z.object({
  businessName: z.string().min(2, 'Business Name is required'),
  registrationNumber: z.string().min(2, 'Registration Number is required'),
  address: z.string().min(5, 'Address is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

export type FarmerFormValues = z.infer<typeof farmerSchema>;
export type TransactionFormValues = z.infer<typeof transactionSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
export type InventoryFormValues = z.infer<typeof inventorySchema>;
export type SettingsFormValues = z.infer<typeof settingsSchema>;
