import express from "express";
import { getNotes, getNoteById, createNote, updateNote, deleteNote, getStudentAverage } from "../controllers/noteController.js";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.get("/student/:id", getStudentAverage);

export default router;