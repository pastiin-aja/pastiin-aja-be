import { Router } from "express";
import FraudController from "../controllers/FraudController.js";

class FraudRoutes {
    constructor() {
        this.router = Router();
        this.router.get("/all-fraud", FraudController.getAllFraud);
        this.router.post("/fraud-by-photo", FraudController.postFraudPhoto)
        this.router.post("/fraud-by-text", FraudController.postFraudText)
        this.router.get("/fraud-by-fraud-id/:id", FraudController.getFraudByFraudId)
        this.router.get("/fraud-by-user-id/:id", FraudController.getFraudByUserId)
    }
}

export default new FraudRoutes().router