/*
 * Contrôleur des étudiants (Student).
 *
 * Ce module fournit les handlers pour toutes les opérations CRUD sur les étudiants. Chaque
 * fonction récupère ou manipule des documents dans MongoDB via le modèle Mongoose correspondant.
 */

import Student from "../models/studentModel.js";
import mongoose from "mongoose";

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

/**
 * Récupère un étudiant avec toutes ses notes + les matières associées.
 */
export const getStudentFull = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    const result = await Student.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(studentId) }
      },
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "student",
          as: "notes"
        }
      },
      {
        $lookup: {
          from: "matieres",
          localField: "notes.matiere",
          foreignField: "_id",
          as: "matieres"
        }
      },
      {
        $addFields: {
          notes: {
            $map: {
              input: "$notes",
              as: "note",
              in: {
                _id: "$$note._id",
                value: "$$note.value",
                type: "$$note.type",
                date: "$$note.date",
                matiere: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$matieres",
                        as: "m",
                        cond: { $eq: ["$$m._id", "$$note.matiere"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          matieres: 0
        }
      }
    ]);

    res.status(200).json(result[0] || null);
  } catch (error) {
    next(error);
  }
};

