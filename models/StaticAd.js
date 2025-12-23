import mongoose from "mongoose";

const StaticAdSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.StaticAd ||
  mongoose.model("StaticAd", StaticAdSchema);
