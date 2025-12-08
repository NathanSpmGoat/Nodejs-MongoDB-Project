import Student from "../models/studentModel.js";

export const getStudents = async(req,res)=>{
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStudentById = async (req,res)=>{
    try {
        const student = await Student.findById(req.params.id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createStudent = async (req,res)=>{
    try {
        const { firstname, lastname, email, grade } = req.body;
        const student = await Student.create({ firstname, lastname, email, grade });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateStudent = async (req,res)=> {
    try{
        const { firstname, lastname, email, grade } = req.body;
        const student = await Student.findByIdAndUpdate(req.params.id, { firstname, lastname, email, grade }, { new: true });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteStudent = async (req,res)=>{
    try{
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Student supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}