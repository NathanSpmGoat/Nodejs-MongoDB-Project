/*
 * Contrôleur des étudiants (Student).
 *
 * Ce module fournit les handlers pour toutes les opérations CRUD sur les étudiants. Chaque
 * fonction récupère ou manipule des documents dans MongoDB via le modèle Mongoose correspondant.
 */

import Student from "../models/studentModel.js";
import mongoose from "mongoose";
import Validator from "validatorjs";

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
  const rules = {
    firstname: "required|string|min:2",
    lastname: "required|string|min:2",
    email: "required|email",
    grade: "required|string",
  };

  const validation = new Validator(req.body, rules);
  if (validation.fails()) {
    return res.status(422).json(validation.errors.all());
  }

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
  const rules = {
    firstname: "required|string|min:2",
    lastname: "required|string|min:2",
    email: "required|email",
    grade: "required|string",
  };

  const validation = new Validator(req.body, rules);
  if (validation.fails()) {
    return res.status(422).json(validation.errors.all());
  }

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
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


/**
 * GET avancé : recherche + filtres + pagination sur les étudiants
 */
export const getStudentsAdvanced = async (req, res, next) => {
  try {
    // Récupération des paramètres de requête
    const { grade, q, page = 1, limit = 10 } = req.query;

    // Objet filtre MongoDB
    const filter = {};

    // Filtre par grade si présent
    if (grade) filter.grade = grade;

    // Recherche textuelle sur prénom, nom ou email
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { firstname: regex },
        { lastname: regex },
        { email: regex }
      ];
    }

    // Pagination sécurisée
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const skip = (pageNum - 1) * limitNum;

    // Requête MongoDB
    const [items, total] = await Promise.all([
      Student.find(filter)
        .sort({ lastname: 1, firstname: 1 })
        .skip(skip)
        .limit(limitNum),
      Student.countDocuments(filter),
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

/**
 * Agrégation MongoDB : top étudiants par moyenne pondérée
 */
export const getTopStudentsByAverage = async (req, res, next) => {
  try {
    const limitNum = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 50);

    const pipeline = [
      // Jointure avec la collection notes
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "student",
          as: "notes",
        },
      },
      { $unwind: "$notes" },

      // Jointure avec les matières
      {
        $lookup: {
          from: "matieres",
          localField: "notes.matiere",
          foreignField: "_id",
          as: "matiereDoc",
        },
      },
      { $unwind: "$matiereDoc" },

      // Calcul note pondérée
      {
        $addFields: {
          weighted: {
            $multiply: ["$notes.value", "$matiereDoc.coefficient"]
          }
        }
      },

      // Regroupement par étudiant
      {
        $group: {
          _id: "$_id",
          firstname: { $first: "$firstname" },
          lastname: { $first: "$lastname" },
          grade: { $first: "$grade" },
          totalCoeff: { $sum: "$matiereDoc.coefficient" },
          totalWeighted: { $sum: "$weighted" }
        }
      },

      // Calcul de la moyenne
      {
        $addFields: {
          average: { $divide: ["$totalWeighted", "$totalCoeff"] }
        }
      },

      // Tri décroissant par moyenne
      { $sort: { average: -1 } },

      // Limite des résultats
      { $limit: limitNum }
    ];

    const result = await Student.aggregate(pipeline);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


