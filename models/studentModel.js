import mongoose from "mongoose";

/*
 * Schéma Mongoose pour la collection "Student".
 *
 * Un étudiant est caractérisé par son prénom, son nom, son adresse e‑mail (unique) et sa
 * classe/année (grade). Les timestamps permettent d'ajouter automatiquement les dates
 * de création et de mise à jour du document.
 */
const studentSchema = new mongoose.Schema(
  {
    // Prénom de l'étudiant
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    // Nom de famille de l'étudiant
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    // Adresse e‑mail de l'étudiant. Elle doit être unique et est normalisée en minuscules.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Niveau ou classe fréquentée par l'étudiant (ex. "L1", "M2").
    grade: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Création et export du modèle. Mongoose utilisera "students" comme nom de collection.
const Student = mongoose.model("Student", studentSchema);

export default Student;