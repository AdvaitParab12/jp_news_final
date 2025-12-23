import mongoose from "mongoose";

const BreakingNewsSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    href: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.BreakingNews ||
  mongoose.model("BreakingNews", BreakingNewsSchema);
