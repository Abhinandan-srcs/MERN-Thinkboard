import Note from "../model/Note.js";

export async function getAllNotes(req, res) {
  try {
    const { userId } = req.auth;
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.log("Error in getAllNotes controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const { userId } = req.auth;
    const note = await Note.findOne({ _id: req.params.id, userId }); // more secure as it is checking by userId as well
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    console.log("Error in getNoteById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { userId } = req.auth;
    const { title, content, color } = req.body;
    const note = new Note({ title, content, color, userId });
    const savedNote = await note.save();
    res.status(200).json(savedNote);
  } catch (error) {
    console.log("Error in createNote controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { userId } = req.auth;
    const { title, content, color } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId },
      { title, content, color },
      { new: true } // updates newer document
    );

    if (!updatedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(updatedNote);
    
  } catch (error) {
    console.log("Error in updateNote controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const { userId } = req.auth;
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedNote) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNote controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const togglePin = async (req, res) => {
  try {
    const { userId } = req.auth;
    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.isPinned = !note.isPinned;
    await note.save();
    res.json(note);
  } catch (error) {
    console.log("Error in togglePin controller:", error);
    res.status(500).json({ message: "Failed to toggle pin" });
  }
};

export const toggleArchive = async (req, res) => {
  try {
    const { userId } = req.auth;
    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.isArchived = !note.isArchived;
    if (note.isArchived) note.isPinned = false;
    await note.save();
    res.json(note);
  } catch (error) {
    console.log("Error in toggleArchive controller:", error);
    res.status(500).json({ message: "Failed to toggle archive" });
  }
};

export const toggleTrash = async (req, res) => {
  try {
    const { userId } = req.auth;
    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.isTrashed = !note.isTrashed;
    if (note.isTrashed) { note.isPinned = false; note.isArchived = false; }
    await note.save();
    res.json(note);
  } catch (error) {
    console.log("Error in toggleTrash controller:", error);
    res.status(500).json({ message: "Failed to toggle trash" });
  }
};

export const updateLabels = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { labels } = req.body;
    if (!Array.isArray(labels))
      return res.status(400).json({ message: "labels must be an array" });
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId },
      { labels },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    console.log("Error in updateLabels controller:", error);
    res.status(500).json({ message: "Failed to update labels" });
  }
};

