import { Router } from "express";
import FraudController from "../controllers/FraudController.js";

class ContohRoutes {
    constructor() {
        this.router = Router();
        this.router.get("/", FraudController.getAllFraud);
    }
}

export default new ContohRoutes().router;