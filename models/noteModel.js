import mongoose from "mongoose";

/*
 * Schéma Mongoose pour la collection "Note".
 *
 * Chaque note appartient à un étudiant et à une matière. Elle contient la valeur de la note
 * (comprise entre 0 et 20), le type d'évaluation (par défaut "Contrôle") et la date
 * de passation. Les timestamps permettent de conserver les dates de création et de modification.
 */
const noteSchema = new mongoose.Schema(
  {
    // Référence vers l'étudiant ayant obtenu la note.
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    // Référence vers la matière dans laquelle la note a été obtenue.  
    // La valeur de "ref" doit correspondre au nom du modèle exporté (ici "Matiere").
    matiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matiere",
      required: true,
    },
    // Valeur numérique de la note. Les notes sont généralement sur 20 dans le système français.
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },
    // Type d'évaluation (contrôle, devoir, projet…). Permet de catégoriser la note.
    type: {
      type: String,
      default: "Contrôle",
      trim: true,
    },
    // Date de l'évaluation. Par défaut on prend la date courante.
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
