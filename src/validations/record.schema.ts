import { z } from "zod";

const RecordTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const createRecordSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: RecordTypeEnum,
  category: z.string().min(1, "Category is required").max(100),
  date: z.string().datetime("Date must be a valid ISO string"),
  notes: z.string().optional(),
});

export const updateRecordSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  type: RecordTypeEnum.optional(),
  category: z.string().min(1, "Category is required").max(100).optional(),
  date: z.string().datetime("Date must be a valid ISO string").optional(),
  notes: z.string().optional(),
});

export const queryRecordSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  type: RecordTypeEnum.optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type QueryRecordInput = z.infer<typeof queryRecordSchema>;
