import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";
import { dashboardQuerySchema } from "../validations/dashboard.schema";

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = dashboardQuerySchema.parse(req.query);
      const metrics = await DashboardService.getSummaryMetrics(filters);
      res.json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryBreakdown(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = dashboardQuerySchema.parse(req.query);
      const type = req.query.type as "INCOME" | "EXPENSE" | undefined;
      const breakdown = await DashboardService.getCategoryBreakdown({ ...filters, type });
      res.json({ success: true, data: breakdown });
    } catch (error) {
      next(error);
    }
  }
}
