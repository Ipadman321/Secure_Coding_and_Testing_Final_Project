import request from "supertest";
import express from "express";
import loanRoutes from "../src/api/v1/routes/loanRoutes";

// Mocking the entire controller first
jest.mock("../src/api/v1/controllers/loanController", () => ({
  createLoan: jest.fn((req, res, next) => res.status(200).send()),
  reviewLoanById: jest.fn((req, res, next) => res.status(200).send()),
  getAllLoans: jest.fn((req, res, next) => res.status(201).send()),
  approveLoanById: jest.fn((req, res, next) => res.status(200).send()),
}));

// Then import loan controller.
import * as loanController from "../src/api/v1/controllers/loanController";

// Mock the authentication middleware
jest.mock("../src/api/v1/middleware/authenticate", () => 
  jest.fn((req, res, next) => {
    // Set mock user data for testing
    res.locals.uid = "test-user-123";
    res.locals.role = "admin";
    next();
  })
);

describe("Loan Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    // Create new app for each test
    app = express();
    app.use(express.json());
    app.use("/api/v1/loans", loanRoutes);
    jest.clearAllMocks();
  });

  describe("GET /api/v1/loans", () => {
    it("should call getAllLoans controller", async () => {
      await request(app).get("/api/v1/loans/");
      expect(loanController.getAllLoans).toHaveBeenCalled();
    });
  });

  describe("POST /api/v1/loans", () => {
    it("should call createLoan controller", async () => {
      await request(app).post("/api/v1/loans/").send({
        loanId: 123, 
        amount: 30000, 
        purpose: "Medical-Related",
        status: "Submitted"
      });
      expect(loanController.createLoan).toHaveBeenCalled();
    });
  });

  describe("PUT /api/v1/loans/:id/review", () => {
    it("should call reviewLoanById controller", async () => {
      await request(app).put("/api/v1/loans/123/review").send({
        message: `Loan number 123 has been reviewed.`,
        loanId: 123, 
        status: "Reviewed"
      });
      expect(loanController.reviewLoanById).toHaveBeenCalled();
    });
  });

  describe("PUT /api/v1/loans/:id/approve", () => {
    it("should call approveLoanById controller", async () => {
      await request(app).put("/api/v1/loans/123/approve").send({
        message: `Loan number 123 has been approved.`,
        loanId: 123, 
        status: "Approved"
      });
      expect(loanController.approveLoanById).toHaveBeenCalled();
    });
  });
});