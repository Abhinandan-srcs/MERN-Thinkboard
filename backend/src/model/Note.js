import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  isPinned:  { type: Boolean, default: false },
  color:     { type: String, default: "#00FF9D" },
  userId:    { type: String, required: true },
  isArchived:{ type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  labels:    { type: [String], default: [] },
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema); //Every note in my db should look like this
export default Note;

