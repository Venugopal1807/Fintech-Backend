import { z } from "zod";

export const dashboardQuerySchema = z.object({
  startDate: z.string().datetime("startDate must be a valid ISO string").optional(),
  endDate: z.string().datetime("endDate must be a valid ISO string").optional(),
});

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
