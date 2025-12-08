import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getStudentAverage,
} from "../controllers/noteController.js";

// Routeur pour les notes. Définit les endpoints relatifs à la ressource "Note".
const router = express.Router();

// Liste toutes les notes
router.get("/", getNotes);
// Récupérer une note par ID
router.get("/:id", getNoteById);
// Créer une nouvelle note
router.post("/", createNote);
// Mettre à jour une note existante
router.put("/:id", updateNote);
// Supprimer une note
router.delete("/:id", deleteNote);
// Calculer la moyenne (pondérée) des notes pour un étudiant donné
router.get("/student/:id", getStudentAverage);

export default router;