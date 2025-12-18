import express from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsAdvanced,
  getTopStudentsByAverage,
  getStudentFull,
} from "../controllers/studentController.js";

// Routeur pour les étudiants. Centralise les routes CRUD liées à la ressource "Student".
const router = express.Router();

// Récupérer tous les étudiants
router.get("/", getStudents);

// Récupérer un étudiant avec toutes ses notes + matières
router.get("/:id/full", getStudentFull);

// Créer un nouvel étudiant
router.post("/", createStudent);

// Supprimer un étudiant
router.delete("/:id", deleteStudent);

// Lecture avancée (filtres + pagination)
router.get("/search", getStudentsAdvanced);

// Agrégation MongoDB
router.get("/top/averages", getTopStudentsByAverage);

// Récupérer un étudiant par son ID
router.get("/:id", getStudentById);

// Mettre à jour un étudiant existant
router.put("/:id", updateStudent);


export default router;