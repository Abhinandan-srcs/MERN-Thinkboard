import Note from "../model/Note.js";

export async  function getAllNotes(_, res){
    try {
        const notes = await Note.find().sort({createdAt:-1})
        res.status(200).json(notes)

    } catch (error) {
        console.log("Error in getAllNotes controller")
        res.status(500).json({message:"Internal server error"})
    }
};

export async function getNoteById(req,res) {
    try {
        const note =await Note.findById(req.params.id)
        if(!note) return res.status(404).json({message:"Note not found"})
        res.json(note)
    } catch (error) {
        console.log("Error in getNoteById controller")
        res.status(500).json({message:"Internal server error"})
    }
}

export async function createNote(req, res) {
  try {
    const { title, content, color } = req.body  // 👈 add color
    const note = new Note({ title, content, color })  // 👈 add color
    const savedNote = await note.save();
    res.status(200).json(savedNote);
  } catch (error) {
    console.log("Error in createNote controller");
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function updateNote(req, res) {
  try {
    const { title, content, color } = req.body  // 👈 add color
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, color },  
      { new: true }
    )
    if (!updatedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.log("Error in updatedNote controller");
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function deleteNote(req,res) {
    try {

        const deleteNote = await Note.findByIdAndDelete(req.params.id)
        if(!deleteNote) return res.status(404).json({message:"Note not found"})
        res.status(200).json({message:"Note deleted successfully"})
    } catch (error) {
        console.log("Error in deleteNote controller",error)
        res.status(500).json({message:"Internal server error"})
    }
};

export const togglePin = async(req,res) => {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message:"Note not found"});

        note.isPinned = !note.isPinned
        await note.save();
        res.json(note);

    } catch (error) {
        res.status(500).json({message:"Failed to toggle pin"})
    }
}