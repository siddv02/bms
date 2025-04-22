import express from "express";
import { runMLModel } from "../controllers/ml.js";

const router = express.Router();

router.get("/run", runMLModel);

export default router;
