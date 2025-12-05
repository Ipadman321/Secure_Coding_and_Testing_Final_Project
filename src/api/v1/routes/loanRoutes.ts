import express from "express";
import {
    getAllLoans,
    createLoan,
    reviewLoanById,
    approveLoanById,
} from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: express.Router = express.Router();

router.get(
    "/", 
    authenticate,
    isAuthorized({ hasRole: ["officer", "manager", "admin"] }),
    getAllLoans
);
router.post(
    "/", 
    authenticate,
    isAuthorized({ hasRole: ["user", "admin"] }),
    createLoan
);
router.put(
    "/:id/review",
    authenticate,
    isAuthorized({ hasRole: ["officer", "admin"] }),
    reviewLoanById
);
router.put(
    "/:id/approve",
    authenticate,
    isAuthorized({ hasRole: ["manager", "admin"]}),
    approveLoanById
);

export default router;