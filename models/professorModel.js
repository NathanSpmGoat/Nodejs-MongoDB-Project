import mongoose from "mongoose";

/*
 * Schéma Mongoose pour la collection "Professor".
 *
 * Un professeur est défini par son prénom, son nom, son adresse e‑mail (unique) et
 * le département ou la filière dans laquelle il enseigne. Les timestamps permettent
 * de stocker automatiquement les dates de création et de mise à jour du document.
 */
const professorSchema = new mongoose.Schema(
  {
    // Prénom du professeur
    firstname: { type: String, required: true, trim: true },
    // Nom du professeur
    lastname: { type: String, required: true, trim: true },
    // Adresse e‑mail professionnelle. Elle est unique et convertie en minuscules.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Département ou filière dans laquelle le professeur exerce (ex. "Informatique").
    matieres: { type: Array, required: true },
  },
  { timestamps: true }
);

// Création et export du modèle. Mongoose utilisera le nom "professors" pour la collection.
const Professor = mongoose.model("Professor", professorSchema);
export default Professor;
