import Note from "../models/noteModel.js";

export const getNotes = async(req,res)=>{
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNoteById = async (req,res)=>{
    try {
        const note = await Note.findById(req.params.id);
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createNote = async (req,res)=>{
    try {
        const { student, matiere, value, type, date } = req.body;
        const note = await Note.create({ student, matiere, value, type, date });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateNote = async (req,res)=> {
    try {
        const { student, matiere, value, type, date } = req.body;
        const note = await Note.findByIdAndUpdate(req.params.id, { student, matiere, value, type, date }, { new: true });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteNote = async (req,res)=>{
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Note supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStudentAverage = async (req, res) => {
    try {
      const studentId = req.params.id;
      
      const notes = await Note.find({ student: studentId });
  
      if (notes.length === 0) {
        return res.status(200).json({
          studentId,
          average: null,
          count: 0
        });
      }
  
      const average = notes.reduce((acc, note) => acc + note.value, 0) / notes.length;
  
      res.status(200).json({
        studentId,
        average,
        count: notes.length
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  