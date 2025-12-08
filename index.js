import express from "express";
import connect from "./config/database.js";

import matiereRoutes from "./routes/matiereRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import professorRoutes from "./routes/professorRoutes.js";

/*
 * Fichier d'entrée de l'application.
 *
 * On y configure l'instance Express, on se connecte à MongoDB via Mongoose,
 * on installe les middlewares nécessaires et on monte les routeurs pour
 * chaque entité (matières, notes, étudiants, professeurs).
 */

const app = express();

// Middleware permettant de transformer le corps JSON des requêtes HTTP en objet JavaScript.
app.use(express.json());

// Connexion à la base de données MongoDB. Cette fonction retourne une promesse.
// On log en cas d'erreur pour éviter un plantage silencieux de l'application.
connect().catch((err) => {
  console.error("Échec de la connexion à MongoDB", err);
});

// Montage des routeurs par ressource. Les préfixes définissent la racine des endpoints.
app.use("/matieres", matiereRoutes);
app.use("/notes", noteRoutes);
app.use("/students", studentRoutes);
app.use("/professors", professorRoutes);

// Définition du port. On utilise une variable d'environnement si disponible
const PORT = process.env.PORT || 3000;

// Lancement du serveur HTTP.
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});