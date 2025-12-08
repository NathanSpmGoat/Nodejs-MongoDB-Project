import fs from "fs";
import Student from "./models/studentModel.js";
import Matiere from "./models/matiereModel.js";
import Note from "./models/noteModel.js";
import connect from "./config/database.js";

function loadJSON(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

async function importData() {
  await connect();

  const studentsData = loadJSON("./data/students.json");
  const matieresData = loadJSON("./data/matieres.json");
  const notesData = loadJSON("./data/notes.json");

  await Student.deleteMany({});
  await Matiere.deleteMany({});
  await Note.deleteMany({});

  await Student.insertMany(studentsData);
  await Matiere.insertMany(matieresData);
  await Note.insertMany(notesData);

  process.exit(0);
}

importData();
