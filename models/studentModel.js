import mongoose from "mongoose";
import validator from "validator";

/*
 * Schéma Mongoose pour la collection "Student".
 *
 * Un étudiant est caractérisé par son prénom, son nom, son adresse e-mail (unique) et sa
 * classe/année (grade). Les timestamps ajoutent automatiquement createdAt et updatedAt.
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
    // Adresse e-mail de l'étudiant. Elle doit être unique et validée.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "L'adresse e-mail fournie n'est pas valide.",
      },
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

// Création et export du modèle.
const Student = mongoose.model("Student", studentSchema);

export default Student;
