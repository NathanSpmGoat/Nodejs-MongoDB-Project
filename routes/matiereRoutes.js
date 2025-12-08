import express from "express";
import { getMatieres, getMatiereById, createMatiere, updateMatiere, deleteMatiere } from "../controllers/matiereController.js";

const router = express.Router();

router.get("/", getMatieres);
router.get("/:id", getMatiereById);
router.post("/", createMatiere);
router.put("/:id", updateMatiere);
router.delete("/:id", deleteMatiere);

export default router;