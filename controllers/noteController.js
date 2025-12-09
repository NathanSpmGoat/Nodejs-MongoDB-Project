/*
 * Contrôleur des notes (Note).
 *
 * Définit les handlers des routes liées à la ressource "Note". Les fonctions récupèrent,
 * créent, mettent à jour et suppriment des notes, et calculent la moyenne des notes
 * d'un étudiant en tenant compte des coefficients des matières.
 */

import Note from "../models/noteModel.js";

/**
 * Récupère l'ensemble des notes.
 */
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère une note par son identifiant. Retourne 404 si elle n'existe pas.
 */
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note non trouvée" });
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * Crée une nouvelle note. Les champs sont extraits explicitement du corps de la requête.
 */
export const createNote = async (req, res, next) => {
  try {
    const { student, matiere, value, type, date } = req.body;
    const note = await Note.create({ student, matiere, value, type, date });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * Met à jour une note existante. Retourne 404 si la note n'existe pas.
 */
export const updateNote = async (req, res, next) => {
  try {
    const { student, matiere, value, type, date } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { student, matiere, value, type, date },
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ message: "Note non trouvée" });
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime une note. Retourne 404 si elle n'existe pas.
 */
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note non trouvée" });
    }
    res.status(200).json({ message: "Note supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};

/**
 * Calcule la moyenne des notes d'un étudiant. La moyenne est pondérée par le
 * coefficient de chaque matière afin de refléter l'importance relative des matières.
 * Si l'étudiant n'a pas de notes, la moyenne renvoyée est null.
 */
export const getStudentAverage = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    const notes = await Note.find({ student: studentId }).populate("matiere", "coefficient");

    if (notes.length === 0) {
      return res.status(200).json({
        studentId,
        average: null,
        count: 0,
      });
    }

    const { weightedSum, totalCoeff } = notes.reduce(
      (acc, note) => {
        const coeff = note.matiere?.coefficient || 1;
        return {
          weightedSum: acc.weightedSum + note.value * coeff,
          totalCoeff: acc.totalCoeff + coeff,
        };
      },
      { weightedSum: 0, totalCoeff: 0 }
    );

    const average = totalCoeff > 0 ? weightedSum / totalCoeff : null;

    res.status(200).json({
      studentId,
      average,
      count: notes.length,
    });
  } catch (error) {
    next(error);
  }
};
