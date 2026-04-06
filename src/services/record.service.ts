import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { CreateRecordInput, UpdateRecordInput, QueryRecordInput } from "../validations/record.schema";

export class RecordService {
  static async createRecord(userId: string, data: CreateRecordInput) {
    return prisma.financialRecord.create({
      data: {
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: new Date(data.date),
        notes: data.notes,
        createdById: userId,
      },
    });
  }

  static async getRecords(filters: QueryRecordInput) {
    const { page, limit, type, category, startDate, endDate } = filters;
    // skip logic for pagination
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.FinancialRecordWhereInput = {
      isDeleted: false,
    };

    if (type) where.type = type;
    if (category) where.category = category;
    
    if (startDate || endDate) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      where.date = dateFilter;
    }

    const [total, records] = await Promise.all([
      prisma.financialRecord.count({ where }),
      prisma.financialRecord.findMany({
        where,
        skip,
        take,
        orderBy: { date: "desc" },
      }),
    ]);

    return { total, page, limit, records };
  }

  static async updateRecord(id: string, data: UpdateRecordInput) {
    const updateData: Prisma.FinancialRecordUpdateInput = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    return prisma.financialRecord.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteRecord(id: string) {
    return prisma.financialRecord.update({
      where: { id },
      data: { 
        isDeleted: true,
        deletedAt: new Date()
      },
    });
  }
}
