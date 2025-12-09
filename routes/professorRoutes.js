import express from "express";
import {
  getProfessors,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  getProfessorMatieres,
} from "../controllers/professorController.js";

// Routeur pour les professeurs. Permet de gérer les opérations CRUD sur la ressource "Professor".
const router = express.Router();

// Liste tous les professeurs
router.get("/", getProfessors);
// Récupère un professeur par son ID
router.get("/:id", getProfessorById);
// Récupère toutes les matières d'un professeur
router.get("/:id/matieres", getProfessorMatieres);
// Crée un professeur
router.post("/", createProfessor);
// Met à jour un professeur
router.put("/:id", updateProfessor);
// Supprime un professeur
router.delete("/:id", deleteProfessor);

export default router;
