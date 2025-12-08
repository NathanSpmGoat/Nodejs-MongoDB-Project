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
export const getMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (error) {
    // Erreur serveur inattendue
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupère une matière par son identifiant. Retourne 404 si elle n'existe pas.
 */
export const getMatiereById = async (req, res) => {
  try {
    const matiere = await Matiere.findById(req.params.id);
    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    res.status(200).json(matiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Crée une nouvelle matière. Les champs requis sont extraits explicitement
 * afin de ne pas enregistrer de données indésirables.
 */
export const createMatiere = async (req, res) => {
  try {
    const { name, coefficient, description } = req.body;
    const matiere = await Matiere.create({ name, coefficient, description });
    res.status(201).json(matiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Met à jour une matière existante. Retourne 404 si la matière n'existe pas.
 */
export const updateMatiere = async (req, res) => {
  try {
    const { name, coefficient, description } = req.body;
    const matiere = await Matiere.findByIdAndUpdate(
      req.params.id,
      { name, coefficient, description },
      { new: true }
    );
    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    res.status(200).json(matiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Supprime une matière par son identifiant. Retourne 404 si la matière n'existe pas.
 */
export const deleteMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.findByIdAndDelete(req.params.id);
    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    res.status(200).json({ message: "Matière supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
