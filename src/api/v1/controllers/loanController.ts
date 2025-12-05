import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Loan } from "../models/loanModel";

// Loan data
let LoanData: Loan[] = [
    { 
        id: 826, 
        name: "John Doe", 
        email: "john@example.com", 
        loanAmount: 15000, 
        reason: "Home Renovation",
        status: "Submitted"
    },
    { 
        id: 292, 
        name: "Jane Smith", 
        email: "jane@example.com", 
        loanAmount: 25000, 
        reason: "Business Expansion",
        status: "Under Review" 
    },
    { 
        id: 372, 
        name: "Bob Johnson", 
        email: "bob@example.com", 
        loanAmount: 10000, 
        reason: "Debt Consolidation",
        status: "Rejected" 
    }
];

const newLoanId = (): number => {
    return Math.floor(Math.random() * 1000);
};

// Only to be used by User role.
export const createLoan = (req: Request, res: Response) => {
    try {
        // Attempts to upload/create specific loan application.
        const { name, email, loanAmount, reason } = req.body;
        const newLoan: Loan = {
            id: newLoanId(),
            name,
            email,
            loanAmount,
            reason,
            status: "Submitted"
        };
        LoanData.push(newLoan);

        res.status(HTTP_STATUS.CREATED).json({
            message: `Loan application number ${newLoan.id} has been submitted successfully.`,
            data: newLoan,
        });
    } catch (error) {
        // Error when there is an issue creating a loan.
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error creating loan application.",
        });
    }
};

// Only to be used by Officer role.
export const reviewLoanById = (req: Request, res: Response) => {
    try {
        // Attempts to update status of a loan to review by the ID number.
        const id = parseInt(req.params.id);
        const loanUpdate = updateLoan(id, { 
            status: 'Under Review',
            ...req.body
        });

        res.status(HTTP_STATUS.OK).json({
            message: `Loan number ${id} has been updated.`,
            data: loanUpdate,
        });
    } catch (error) {
        // Error when there is an issue updating to review for the loan 
        // by it's ID.
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error reviewing loan.",
        });
    }
};

// Only to be used by Manager and Officer role.
export const getAllLoans = (req: Request, res: Response) => {
    try {
        // Attempts to retrieve all loans.
        res.status(HTTP_STATUS.OK).json({
            message: "Retrieved all Loans.",
            data: LoanData,
        });
    } catch (error) {
        // Error when there is an issue retrieving loans.
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error retrieving Loans.",
        });
    }
};

// Only to be used by Manager role.
export const approveLoanById = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const loanUpdate = updateLoan(id, { 
            status: 'Approved',
            ...req.body 
        });

        res.status(HTTP_STATUS.OK).json({
            message: `Loan number ${id} has been approved.`,
            data: loanUpdate,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error approving loan.",
        });
    }
};

// Updates the loan whenever called.
const updateLoan = (id: number, updateData: Partial<Loan>): Loan | null => {
    const loanIndex = LoanData.findIndex(loan => loan.id === id);
    
    if (loanIndex === -1) {
        return null;
    }

    LoanData[loanIndex] = {
        ...LoanData[loanIndex],
        ...updateData
    };

    return LoanData[loanIndex];
};