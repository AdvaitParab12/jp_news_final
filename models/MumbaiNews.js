import mongoose from "mongoose";

const MumbaiNewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    category: { type: String, required: true },
    image: {
      url: String,
      public_id: String,
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.MumbaiNews ||
  mongoose.model("MumbaiNews", MumbaiNewsSchema);
