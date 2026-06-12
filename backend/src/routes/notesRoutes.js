import express from "express";
import {
  createNote, deleteNote, getAllNotes, updateNote,
  getNoteById, togglePin, toggleArchive, toggleTrash, updateLabels,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/",            getAllNotes);
router.get("/:id",         getNoteById);
router.post("/",           createNote);
router.put("/:id",         updateNote);
router.delete("/:id",      deleteNote);
router.patch("/:id/pin",   togglePin);
router.patch("/:id/archive", toggleArchive);
router.patch("/:id/trash",   toggleTrash);
router.patch("/:id/labels",  updateLabels);

export default router;
