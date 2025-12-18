/*
 * Contrôleur des professeurs (Professor).
 *
 * Ce fichier regroupe les fonctions qui assurent la gestion CRUD des professeurs.
 * Chaque fonction interagit avec le modèle Mongoose pour effectuer l'opération souhaitée
 * et renvoie une réponse HTTP adaptée.
 */

import Professor from "../models/professorModel.js";
import Matiere from "../models/matiereModel.js";

/**
 * Récupère tous les professeurs.
 */
export const getProfessors = async (req, res, next) => {
  try {
    const list = await Professor.find();
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère un professeur par son ID. Retourne 404 s'il n'existe pas.
 */
export const getProfessorById = async (req, res, next) => {
  try {
    const prof = await Professor.findById(req.params.id);
    if (!prof) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }
    res.status(200).json(prof);
  } catch (error) {
    next(error);
  }
};

/**
 * Crée un nouveau professeur. Les champs du corps de la requête sont utilisés tels quels.
 */
export const createProfessor = async (req, res, next) => {
  try {
    const prof = await Professor.create(req.body);
    res.status(201).json(prof);
  } catch (error) {
    next(error);
  }
};

/**
 * Met à jour un professeur. Retourne 404 si le professeur n'existe pas.
 */
export const updateProfessor = async (req, res, next) => {
  try {
    const prof = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!prof) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }
    res.status(200).json(prof);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime un professeur. Retourne 404 si le professeur n'existe pas.
 */
export const deleteProfessor = async (req, res, next) => {
  try {
    const prof = await Professor.findByIdAndDelete(req.params.id);
    if (!prof) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }
    res.status(200).json({ message: "Professeur supprimé" });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère toutes les matières enseignées par un professeur.
 */
export const getProfessorMatieres = async (req, res, next) => {
  try {
    const prof = await Professor.findById(req.params.id);
    if (!prof) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }

    const matieresIds = prof.matieres || [];
    const matieres = await Matiere.find({ _id: { $in: matieresIds } });

    res.status(200).json({
      professor: {
        id: prof._id,
        firstname: prof.firstname,
        lastname: prof.lastname,
        email: prof.email,
      },
      matieres,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lecture avancée : recherche + pagination des professeurs
 */
export const getProfessorsAdvanced = async (req, res, next) => {
  try {
    const { q, matiere, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { firstname: regex },
        { lastname: regex },
        { email: regex }
      ];
    }

    if (matiere) filter.matieres = matiere;

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Professor.find(filter).skip(skip).limit(limitNum),
      Professor.countDocuments(filter)
    ]);

    res.status(200).json({
      page: pageNum,
      total,
      items
    });
  } catch (error) {
    next(error);
  }
};
