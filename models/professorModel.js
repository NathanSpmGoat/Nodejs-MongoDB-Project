import mongoose from "mongoose";
import validator from "validator";

/*
 * Schéma Mongoose pour la collection "Professor".
 *
 * Un professeur est défini par son prénom, son nom, son adresse e-mail (unique) et
 * les matières/enseignements qu’il dispense. Les timestamps ajoutent automatiquement
 * createdAt et updatedAt.
 */
const professorSchema = new mongoose.Schema(
  {
    // Prénom du professeur
    firstname: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Nom du professeur
    lastname: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Adresse e-mail professionnelle (unique + validation + normalisation)
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

    // Liste des matières/filières enseignées
    matieres: { 
      type: Array, 
      required: true 
    },
  },
  { timestamps: true }
);

// Création et export du modèle.
const Professor = mongoose.model("Professor", professorSchema);
export default Professor;
