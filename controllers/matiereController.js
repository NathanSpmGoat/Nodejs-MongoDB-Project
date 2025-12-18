/*
 * Contrôleur des matières (Matiere).
 *
 * Ce module définit les fonctions qui gèrent les requêtes HTTP pour la ressource "Matiere".
 * Chaque fonction correspond à une opération CRUD et utilise le modèle Mongoose correspondant.
 */

import Matiere from "../models/matiereModel.js";

/**
 * Récupère la liste de toutes les matières.
 */
export const getMatieres = async (req, res, next) => {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère une matière par son identifiant. Retourne 404 si elle n'existe pas.
 */
export const getMatiereById = async (req, res, next) => {
  try {
    const matiere = await Matiere.findById(req.params.id);
    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    res.status(200).json(matiere);
  } catch (error) {
    next(error);
  }
};

/**
 * Crée une nouvelle matière. Les champs requis sont extraits explicitement
 * afin de ne pas enregistrer de données indésirables.
 */
export const createMatiere = async (req, res, next) => {
  try {
    const { name, coefficient, description } = req.body;
    const matiere = await Matiere.create({ name, coefficient, description });
    res.status(201).json(matiere);
  } catch (error) {
    next(error);
  }
};

/**
 * Met à jour une matière existante. Retourne 404 si la matière n'existe pas.
 */
export const updateMatiere = async (req, res, next) => {
  try {
    const { name, coefficient, description } = req.body;
    const matiere = await Matiere.findByIdAndUpdate(
      req.params.id,
      { name, coefficient, description },
      { new: true, runValidators: true }
    );
    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    res.status(200).json(matiere);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime une matière par son identifiant. Retourne 404 si la matière n'existe pas.
 */
export const deleteMatiere = async (req, res, next) => {
  try {
    const matiere = await Matiere.findByIdAndDelete(req.params.id);
    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    res.status(200).json({ message: "Matière supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};

export const getMatieresAdvanced = async (req, res, next) => {
  try {
    const { q, minCoeff, maxCoeff, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }
    if (minCoeff || maxCoeff) {
      filter.coefficient = {};
      if (minCoeff) filter.coefficient.$gte = Number(minCoeff);
      if (maxCoeff) filter.coefficient.$lte = Number(maxCoeff);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Matiere.find(filter).sort({ coefficient: -1, name: 1 }).skip(skip).limit(limitNum),
      Matiere.countDocuments(filter),
    ]);

    res.status(200).json({ page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum), items });
  } catch (error) {
    next(error);
  }
};

export const getMatieresStats = async (req, res, next) => {
  try {
    const sortField = req.query.sort === "count" ? "count" : "avg";
    const order = req.query.order === "asc" ? 1 : -1;

    const pipeline = [
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "matiere",
          as: "notes",
        },
      },
      {
        $addFields: {
          count: { $size: "$notes" },
          avg: { $avg: "$notes.value" },
        },
      },
      { $project: { notes: 0 } },
      { $sort: { [sortField]: order, name: 1 } },
    ];

    const result = await Matiere.aggregate(pipeline);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

