import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  color: {               // 👈 ADD THIS
    type: String,
    default: "#00FF9D",
  },
}, {
  timestamps: true, //createdAt and updatedAT
});

const Note = mongoose.model("Note", noteSchema);

export default Note;