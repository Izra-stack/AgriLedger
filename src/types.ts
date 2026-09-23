export type InventoryCategory = 'Fertilizer' | 'Seeds' | 'Chemicals' | 'Equipment';

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
