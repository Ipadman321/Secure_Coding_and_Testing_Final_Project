import express, { Express } from "express";
import morgan from "morgan";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import { accessLogger, errorLogger, consoleLogger } from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";

const app: Express = express();

if (process.env.NODE_ENV === "development") {
    app.use(consoleLogger);
} else {
    // Use Morgan for HTTP request logging.
app.use(morgan("combined"));
}

// Initiates accesslogs after other logs start generating.
app.use(accessLogger);

// JSON body parsing.
app.use(express.json());

// Test route.
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Testing Health Check Endpoint.
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

//Initialize use of routes.
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/admin", adminRoutes)

// Error logging after everything starts running.
app.use(errorLogger);

// Handles all errors after logging when everything starts running.
app.use(errorHandler);

// Initialize Express server.
const PORT: string | 3000 = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;