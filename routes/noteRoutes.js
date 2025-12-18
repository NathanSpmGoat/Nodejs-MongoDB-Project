import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getStudentAverage,
  getNotesAdvanced
} from "../controllers/noteController.js";

// Routeur pour les notes. Définit les endpoints relatifs à la ressource "Note".
const router = express.Router();

// Liste toutes les notes
router.get("/", getNotes);
// Lecture avancée avec filtres et pagination
router.get("/search", getNotesAdvanced);
// Créer une nouvelle note
router.post("/", createNote);
// Calculer la moyenne (pondérée) des notes pour un étudiant donné
router.get("/student/:id", getStudentAverage);
// Récupérer une note par ID
router.get("/:id", getNoteById);
// Mettre à jour une note existante
router.put("/:id", updateNote);
// Supprimer une note
router.delete("/:id", deleteNote);

export default router;