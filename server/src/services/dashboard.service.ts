import { prisma } from "../config/prisma.js";

export const DashboardService = {
  async getSummary() {
    // 1. Total Ledger Value (Sum of all transaction amounts)
    const ledgerResult = await prisma.transactions.aggregate({
      _sum: { amount: true, balance: true }
    });
    
    // 2. Total Collected (Sum of all payments)
    const paymentsResult = await prisma.payments.aggregate({
      _sum: { amount: true }
    });

    // 3. Active Farmers
    const activeFarmers = await prisma.farmers.count({
      where: { status: 'ACTIVE' } // Assuming 'ACTIVE' is the status in DB
    });

    // 4. Total Cash Advances
    const cashAdvancesResult = await prisma.transactions.aggregate({
      where: { type: 'CASH_ASSISTANCE' },
      _sum: { amount: true }
    });

    const totalLedgerValue = Number(ledgerResult._sum.amount || 0);
    const totalOutstanding = Number(ledgerResult._sum.balance || 0);
    const totalCollected = Number(paymentsResult._sum.amount || 0);
    const totalCashAdvances = Number(cashAdvancesResult._sum.amount || 0);

    return {
      totalLedgerValue,
      totalOutstanding,
      totalCollected,
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
