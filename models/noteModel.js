import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",   
      required: true,
    },
    matiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",    
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      max: 20,            
    },
    type: {
      type: String,        
      default: "Contrôle",
      trim: true,
    },
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
