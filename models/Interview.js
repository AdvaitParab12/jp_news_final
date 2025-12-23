import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String },
    videoUrl: { type: String, required: true },
    createdBy: { type: String },
    thumbnail: {
      url: String,
      public_id: String,
      title: String,
      description: String,
    },
    date: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Interview ||
  mongoose.model("Interview", InterviewSchema);
