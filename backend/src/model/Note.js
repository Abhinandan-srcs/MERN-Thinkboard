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

  color: {               
    type: String,
    default: "#00FF9D",
  },
  
  userId:{
    type:String,
    required:true
  },

}, {
  timestamps: true, //createdAt and updatedAT
});

const Note = mongoose.model("Note", noteSchema);

export default Note;