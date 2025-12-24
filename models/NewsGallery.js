import mongoose from "mongoose";

const NewsGallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    createdBy: { type: String },
    // optional thumbnail/image object to mirror other models
    image: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.NewsGallery ||
  mongoose.model("NewsGallery", NewsGallerySchema);
