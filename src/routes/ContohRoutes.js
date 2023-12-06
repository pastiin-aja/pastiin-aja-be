import { Router } from "express";
import ContohController from "../controllers/ContohController.js";

class ContohRoutes {
    constructor() {
        this.router = Router();
        this.router.get("/", ContohController.getAllUser);
    }
}

export default new ContohRoutes().router;