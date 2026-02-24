import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    source: {
      type: String,
      default: "Website"
    },
    message: String,
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new"
    },
    notes: [noteSchema]
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
