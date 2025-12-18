import express from "express";
import {
  getMatieres,
  getMatiereById,
  createMatiere,
  updateMatiere,
  deleteMatiere,
  getMatieresAdvanced, 
  getMatieresStats
} from "../controllers/matiereController.js";

// Création d'un routeur spécifique aux matières. Un routeur permet de définir des sous‑routes
// qui seront montées dans le fichier principal (index.js).
const router = express.Router();

// Récupérer toutes les matières
router.get("/", getMatieres);
// Lecture avancée (filtres + pagination)
router.get("/search", getMatieresAdvanced);
// Statistiques sur les matières
router.get("/stats", getMatieresStats);
// Créer une nouvelle matière
router.post("/", createMatiere);
// Mettre à jour une matière existante
router.put("/:id", updateMatiere);
// Supprimer une matière
router.delete("/:id", deleteMatiere);
// Récupérer une matière par son ID
router.get("/:id", getMatiereById);

export default router;