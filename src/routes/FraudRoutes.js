import { Router } from "express";
import FraudController from "../controllers/FraudController.js";

class FraudRoutes {
    constructor() {
        this.router = Router();
        this.router.get("/", FraudController.getAllFraud);
    }
}

export default new FraudRoutes().router;