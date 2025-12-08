import mongoose from "mongoose";
import dotenv from "dotenv";

// Chargement des variables d'environnement depuis le fichier .env.
// Cela permet de définir l'URI de connexion à la base de données sans la
// enregistrer en dur dans le code source.
dotenv.config();

/**
 * Initialise la connexion à la base de données MongoDB via Mongoose.
 *
 * Cette fonction retourne une promesse et permet d'attendre l'établissement de
 * la connexion avant de lancer le serveur. En cas d'erreur de connexion,
 * l'exception est propagée et doit être gérée par le module appelant.
 */
export default async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "La variable d'environnement MONGODB_URI n'est pas définie. Veuillez la renseigner dans un fichier .env."
    );
  }
  await mongoose.connect(uri);
  console.log("MongoDB connecté avec Mongoose");
}
