import express from "express";
import {
  createLead,
  getLeads,
  updateLeadStatus,
  addNote,
  updateNote,
  deleteNote,
} from "../controllers/leadController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", createLead);
router.get("/", getLeads);
router.patch("/:id/status", updateLeadStatus);
router.post("/:id/notes", addNote);
router.patch("/:id/notes/:noteId", updateNote);
router.delete("/:id/notes/:noteId", deleteNote);

router.get("/", authMiddleware, getLeads);
router.patch("/:id/status", authMiddleware, updateLeadStatus);
router.post("/:id/notes", authMiddleware, addNote);
router.patch("/:id/notes/:noteId", authMiddleware, updateNote);
router.delete("/:id/notes/:noteId", authMiddleware, deleteNote);

export default router;
