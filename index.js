import express from "express";
import connect from "./config/database.js";

import matiereRoutes from "./routes/matiereRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();


app.use(express.json());


connect();


app.use("/matieres", matiereRoutes); 
app.use("/notes", noteRoutes);          
app.use("/students", studentRoutes);     


app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});