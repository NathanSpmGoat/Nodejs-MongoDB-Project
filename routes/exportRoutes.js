import express from "express";
import fs from "fs";
import path from "path";

import Student from "../models/studentModel.js";
import Matiere from "../models/matiereModel.js";
import Note from "../models/noteModel.js";
import Professor from "../models/professorModel.js";

const router = express.Router();

function ensureExportsDir() {
  const exportsDir = path.join(process.cwd(), "data", "exports");
  if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });
  return exportsDir;
}

function writeExportFile(filename, data) {
  const exportsDir = ensureExportsDir();
  const exportPath = path.join(exportsDir, filename);

  fs.writeFileSync(exportPath, JSON.stringify(data, null, 2), "utf-8");

  return {
    file: `data/exports/${filename}`,
    count: Array.isArray(data) ? data.length : undefined,
  };
}

// EXPORT STUDENTS
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().lean();
    const meta = writeExportFile("students_export.json", students);

    res.json({
      message: "Export des étudiants réussi",
      ...meta,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXPORT MATIERES
router.get("/matieres", async (req, res) => {
  try {
    const matieres = await Matiere.find().lean();
    const meta = writeExportFile("matieres_export.json", matieres);

    res.json({
      message: "Export des matières réussi",
      ...meta,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXPORT NOTES
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().lean();
    const meta = writeExportFile("notes_export.json", notes);

    res.json({
      message: "Export des notes réussi",
      ...meta,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXPORT PROFESSORS
router.get("/professors", async (req, res) => {
  try {
    const professors = await Professor.find().lean();
    const meta = writeExportFile("professors_export.json", professors);

    res.json({
      message: "Export des professeurs réussi",
      ...meta,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXPORT ALL D'UN COUP
router.get("/all", async (req, res) => {
  try {
    const [students, matieres, notes, professors] = await Promise.all([
      Student.find().lean(),
      Matiere.find().lean(),
      Note.find().lean(),
      Professor.find().lean(),
    ]);

    const meta = writeExportFile("db_export_all.json", {
      exportedAt: new Date().toISOString(),
      students,
      matieres,
      notes,
      professors,
    });

    res.json({
      message: "Export complet réussi",
      file: meta.file,
      counts: {
        students: students.length,
        matieres: matieres.length,
        notes: notes.length,
        professors: professors.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
