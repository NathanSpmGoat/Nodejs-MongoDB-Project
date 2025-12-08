import fs from "fs";
import Student from "./models/studentModel.js";
import Matiere from "./models/matiereModel.js";
import Note from "./models/noteModel.js";
import Professor from "./models/professorModel.js";
import connect from "./config/database.js";

/*
 * Script de peuplement (seed) de la base de données.
 *
 * Ce script supprime les données existantes puis insère des données de démonstration
 * pour les collections Student, Matiere, Note et Professor. Il est utile pour
 * initialiser l'application avec un jeu de données cohérent lors du développement.
 */

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

async function importData() {
  // Connexion à MongoDB
  await connect();

  // Chargement des fichiers JSON
  const studentsData = loadJSON("./data/students.json");
  const matieresData = loadJSON("./data/matieres.json");
  const notesData = loadJSON("./data/notes.json");
  const professorsData = loadJSON("./data/professors.json");

  // Nettoyage des collections pour éviter les doublons
  await Student.deleteMany({});
  await Matiere.deleteMany({});
  await Note.deleteMany({});
  await Professor.deleteMany({});

  // Insertion des nouvelles données
  await Student.insertMany(studentsData);
  await Matiere.insertMany(matieresData);
  await Note.insertMany(notesData);
  await Professor.insertMany(professorsData);

  console.log("Données de démonstration importées avec succès.");
  process.exit(0);
}

importData().catch((err) => {
  console.error("Erreur lors de l'import des données", err);
  process.exit(1);
});
