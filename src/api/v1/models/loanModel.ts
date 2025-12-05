// Loan Interface
export interface Loan {
    id: number;
    name: string;
    email: string;
    loanAmount: number;
    reason: string;
    status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
}