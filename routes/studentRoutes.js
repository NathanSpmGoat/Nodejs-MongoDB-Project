import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentFull,
} from "../controllers/studentController.js";

// Routeur pour les étudiants. Centralise les routes CRUD liées à la ressource "Student".
const router = express.Router();

// Récupérer tous les étudiants
router.get("/", getStudents);

// Récupérer un étudiant avec toutes ses notes + matières
router.get("/:id/full", getStudentFull);

// Récupérer un étudiant par son ID
router.get("/:id", getStudentById);

// Créer un nouvel étudiant
router.post("/", createStudent);

// Mettre à jour un étudiant existant
router.put("/:id", updateStudent);

// Supprimer un étudiant
router.delete("/:id", deleteStudent);

export default router;