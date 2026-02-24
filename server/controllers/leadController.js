import Lead from "../models/Lead.js";

// Create new lead
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update lead status
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add note to a lead
export const addNote = async (req, res) => {
  try {
    const { text } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.notes.push({ text });

    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { text } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = lead.notes.id(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.text = text;
    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.notes.pull(req.params.noteId);
    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
