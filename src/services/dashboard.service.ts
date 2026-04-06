import { Prisma, RecordType } from "@prisma/client";
import prisma from "../lib/prisma";
import { DashboardQueryInput } from "../validations/dashboard.schema";

function buildDateFilter(filters: DashboardQueryInput): Prisma.FinancialRecordWhereInput {
  const where: Prisma.FinancialRecordWhereInput = { isDeleted: false };

  if (filters.startDate || filters.endDate) {
    const dateFilter: Prisma.DateTimeFilter = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    where.date = dateFilter;
  }

  return where;
}

export class DashboardService {
  static async getSummaryMetrics(filters: DashboardQueryInput) {
    const baseWhere = buildDateFilter(filters);

    const [incomeResult, expenseResult] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: { ...baseWhere, type: RecordType.INCOME },
        _sum: { amount: true },
      }),
      prisma.financialRecord.aggregate({
        where: { ...baseWhere, type: RecordType.EXPENSE },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(incomeResult._sum.amount ?? 0);
    const totalExpense = Number(expenseResult._sum.amount ?? 0);
    const netBalance = totalIncome - totalExpense;

    return {
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      netBalance: parseFloat(netBalance.toFixed(2)),
    };
  }

  static async getCategoryBreakdown(filters: DashboardQueryInput & { type?: "INCOME" | "EXPENSE" }) {
    const baseWhere = buildDateFilter(filters);
    if (filters.type) baseWhere.type = filters.type as RecordType;

    const groups = await prisma.financialRecord.groupBy({
      by: ["category"],
      where: baseWhere,
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    });

    return groups.map((g) => ({
      category: g.category,
      total: parseFloat(Number(g._sum.amount ?? 0).toFixed(2)),
    }));
  }
}
