import { Router } from "express";
import FraudController from "../controllers/FraudController.js";

class FraudRoutes {
    constructor() {
        this.router = Router();
        this.router.get("/all-fraud", FraudController.getAllFraud);
        this.router.post("/post-photo", FraudController.postFraudPhoto)
        this.router.post("/post-text", FraudController.postFraudText)
        this.router.get("/:id", FraudController.getFraudById)
    }
}

export default new FraudRoutes().router