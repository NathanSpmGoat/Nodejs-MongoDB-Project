import mongoose from "mongoose";

/*
 * Schéma Mongoose pour la collection "Matiere".
 *
 * Une matière représente une unité d'enseignement (mathématiques, histoire…). Chaque matière
 * est identifiée par un nom unique et possède un coefficient qui indique son poids dans le calcul
 * de la moyenne d'un étudiant. La description est optionnelle et permet de donner plus de détails.
 */
const matiereSchema = new mongoose.Schema(
  {
    // Nom de la matière (ex. "Mathématiques"). Ce champ est requis, unique et nettoyé des espaces inutiles.
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Coefficient associé à la matière. Permet de pondérer les notes lors du calcul des moyennes.
    coefficient: {
      type: Number,
      required: true,
      min: 1,
    },
    // Description textuelle facultative de la matière.
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Création et export du modèle Mongoose. Le nom "Matiere" est utilisé par Mongoose
// pour déduire le nom de la collection (par défaut au pluriel : "matieres").
const Matiere = mongoose.model("Matiere", matiereSchema);

export default Matiere;