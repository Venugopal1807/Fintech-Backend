import { Request, Response, NextFunction } from "express";
import { RecordService } from "../services/record.service";
import { createRecordSchema, updateRecordSchema, queryRecordSchema } from "../validations/record.schema";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class RecordController {
  static async createRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createRecordSchema.parse(req.body);
      const userId = (req as AuthenticatedRequest).user.id;
      const record = await RecordService.createRecord(userId, validatedData);
      res.status(201).json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  }

  static async getRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = queryRecordSchema.parse(req.query);
      const result = await RecordService.getRecords(filters);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = updateRecordSchema.parse(req.body);
      const record = await RecordService.updateRecord(req.params.id as string, validatedData);
      res.json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await RecordService.deleteRecord(req.params.id as string);
      res.json({ success: true, data: record });
    } catch (error) {
      next(error);
    }
  }
}
