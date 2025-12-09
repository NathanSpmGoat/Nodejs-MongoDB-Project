/*
 * Contrôleur des étudiants (Student).
 *
 * Ce module fournit les handlers pour toutes les opérations CRUD sur les étudiants. Chaque
 * fonction récupère ou manipule des documents dans MongoDB via le modèle Mongoose correspondant.
 */

import Student from "../models/studentModel.js";

/**
 * Récupère la liste de tous les étudiants.
 */
export const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère un étudiant par son identifiant. Retourne 404 si l'étudiant n'existe pas.
 */
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * Crée un nouvel étudiant. Les champs sont destructurés pour éviter d'enregistrer
 * des propriétés inattendues envoyées dans le corps de la requête.
 */
export const createStudent = async (req, res, next) => {
  try {
    const { firstname, lastname, email, grade } = req.body;
    const student = await Student.create({ firstname, lastname, email, grade });
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * Met à jour les informations d'un étudiant. Retourne 404 si l'étudiant n'existe pas.
 */
export const updateStudent = async (req, res, next) => {
  try {
    const { firstname, lastname, email, grade } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, email, grade },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime un étudiant. Retourne 404 si l'étudiant n'existe pas.
 */
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.status(200).json({ message: "Étudiant supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};
