import express from "express";
import { createNote, deleteNote, getAllNotes, updateNote,getNoteById,togglePin } from "../controllers/notesController.js";

const router = express.Router();

router.get("/",getAllNotes);
router.get("/:id",getNoteById);
router.post("/",createNote);
router.put("/:id", updateNote);
router.delete("/:id",deleteNote);
router.patch("/:id/pin",togglePin);

export default router;