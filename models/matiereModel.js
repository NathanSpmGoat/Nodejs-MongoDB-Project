import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    coefficient: {
      type: Number,
      required: true,
      min: 1,          
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Matiere = mongoose.model("Matiere", subjectSchema);

export default Matiere;