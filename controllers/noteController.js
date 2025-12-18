/*
 * Contrôleur des notes (Note).
 *
 * Définit les handlers des routes liées à la ressource "Note". Les fonctions récupèrent,
 * créent, mettent à jour et suppriment des notes, et calculent la moyenne des notes
 * d'un étudiant en tenant compte des coefficients des matières.
 */

import Note from "../models/noteModel.js";
import mongoose from "mongoose";
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
 * Agrégation MongoDB : moyenne pondérée d'un étudiant
 * + affichage prénom et nom
 */
export const getStudentAverage = async (req, res, next) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.params.id);

    const pipeline = [
      // 1. Notes de l’étudiant
      { $match: { student: studentId } },

      // 2. Jointure avec les matières
      {
        $lookup: {
          from: "matieres",
          localField: "matiere",
          foreignField: "_id",
          as: "matiereDoc",
        },
      },
      { $unwind: "$matiereDoc" },

      // 3. Calcul pondéré
      {
        $addFields: {
          weighted: {
            $multiply: ["$value", "$matiereDoc.coefficient"],
          },
        },
      },

      // 4. Regroupement par étudiant
      {
        $group: {
          _id: "$student",
          totalCoeff: { $sum: "$matiereDoc.coefficient" },
          totalWeighted: { $sum: "$weighted" },
        },
      },

      // 5. Jointure avec l’étudiant
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "studentDoc",
        },
      },
      { $unwind: "$studentDoc" },

      // 6. Projection finale
      {
        $project: {
          _id: 0,
          firstname: "$studentDoc.firstname",
          lastname: "$studentDoc.lastname",
          average: {
            $divide: ["$totalWeighted", "$totalCoeff"],
          },
        },
      },
    ];

    const result = await Note.aggregate(pipeline);
    res.status(200).json(result[0] || null);
  } catch (error) {
    next(error);
  }
};


/* Recherche avancée avec filtres, tri et pagination
*/
export const getNotesAdvanced = async (req, res, next) => {
  try {
    const { student, matiere, type, from, to, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (student) filter.student = student;
    if (matiere) filter.matiere = matiere;
    if (type) filter.type = type;

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Note.find(filter).sort({ date: -1 }).skip(skip).limit(limitNum),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
      items,
    });
  } catch (error) {
    next(error);
  }
};



