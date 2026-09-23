import { prisma } from "../config/prisma.js";

export const DashboardService = {
  async getSummary() {
    // 1. Total Ledger Value (Sum of all transaction amounts)
    const ledgerResult = await prisma.transactions.aggregate({
      where: { archived_at: null },
      _sum: { amount: true, balance: true }
    });
    
    // 2. Total Collected (Sum of all payments)
    const paymentsResult = await prisma.payments.aggregate({
      where: { archived_at: null },
      _sum: { amount: true }
    });

    // 3. Active Farmers
    const activeFarmers = await prisma.farmers.count({
      where: { status: 'ACTIVE', archived_at: null }
    });

    // 4. Total Cash Advances
    const cashAdvancesResult = await prisma.transactions.aggregate({
      where: { type: 'CASH_ASSISTANCE', archived_at: null },
      _sum: { balance: true }
    });

    const inputTransactions = await prisma.transactions.findMany({
      where: { inventory_item_id: { not: null }, archived_at: null },
      select: {
        quantity: true,
        inventory_items: { select: { unit_cost: true } },
      },
    });

    const totalLedgerValue = Number(ledgerResult._sum.amount || 0);
    const totalOutstanding = Number(ledgerResult._sum.balance || 0);
    const totalCollected = Number(paymentsResult._sum.amount || 0);
    const totalCashAdvances = Number(cashAdvancesResult._sum.balance || 0);
    const totalCost = inputTransactions.reduce(
      (sum, tx) => sum + Number(tx.quantity || 0) * Number(tx.inventory_items?.unit_cost || 0),
      0,
    );
    const grossProfit = totalCollected - totalCost;

    return {
      totalLedgerValue,
      totalOutstanding,
      totalCollected,
      totalRevenue: totalCollected,
      totalCost,
      grossProfit,
      profitMargin: totalCollected > 0 ? (grossProfit / totalCollected) * 100 : 0,
      activeFarmers,
      totalCashAdvances,
      collectionRate: totalLedgerValue > 0 ? (totalCollected / totalLedgerValue) * 100 : 0
    };
  },

  async getAnalytics() {
    // 1. Monthly Collections
    // Prisma does not have native Group By Month for dates easily across all databases, 
    // so we can fetch payments and group them in JS (fine for small to medium scale)
    const payments = await prisma.payments.findMany({
      where: { archived_at: null },
      select: { amount: true, payment_date: true }
    });

    const monthlyMap = new Map<string, number>();
    payments.forEach(p => {
      const date = new Date(p.payment_date);
      // Format: "Oct 2024"
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const current = monthlyMap.get(monthYear) || 0;
      monthlyMap.set(monthYear, current + Number(p.amount));
    });

    const monthlyCollections = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
      month,
      amount
    }));

    // 2. Transaction Types Data
    const typesResult = await prisma.transactions.groupBy({
      where: { archived_at: null },
      by: ['type'],
      _sum: { amount: true }
    });

    const transactionTypesData = typesResult.map(t => ({
      name: t.type,
      value: Number(t._sum.amount || 0)
    }));

    return {
      monthlyCollections,
      transactionTypesData
    };
  }
};
