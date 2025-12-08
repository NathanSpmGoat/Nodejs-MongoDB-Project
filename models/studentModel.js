import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      trim: true,
    },
    grade: {
      type: String,      
      required: true,
    },
  },
  {
    timestamps: true,  
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;