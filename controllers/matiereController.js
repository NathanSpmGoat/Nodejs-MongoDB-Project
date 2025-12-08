import Matiere from "../models/matiereModel.js";

export const getMatieres = async(req,res)=>{
    try {
        const matieres = await Matiere.find();
        res.status(200).json(matieres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMatiereById = async(req,res)=>{
    try {
        const matiere = await Matiere.findById(req.params.id);
        res.status(200).json(matiere);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createMatiere = async(req,res)=>{
    try {
        const { name, coefficient, description } = req.body;
        const matiere = await Matiere.create({ name, coefficient, description });
        res.status(201).json(matiere);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateMatiere = async (req,res)=> {
    try {
        const { name, coefficient, description } = req.body;
        const matiere = await Matiere.findByIdAndUpdate(req.params.id, { name, coefficient, description }, { new: true });
        res.status(200).json(matiere);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteMatiere = async (req,res)=>{
    try {
        await Matiere.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Matiere supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
