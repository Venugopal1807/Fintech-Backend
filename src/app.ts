import express from "express";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

//  Health Check 

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

import authRoutes from "./routes/auth.routes";
import recordRoutes from "./routes/record.routes";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";

//  Route Registration 
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

//  Global Error Handler (must be last) 

app.use(globalErrorHandler);

export default app;
