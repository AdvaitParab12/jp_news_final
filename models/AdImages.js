  import mongoose from "mongoose";
  import { AD_SECTIONS } from "@/lib/adSections";
  const AdImageSchema = new mongoose.Schema(
    {
      section: {
        type: String,
        enum: Object.values(AD_SECTIONS),
        required: true,
        index: true,
      },
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      hyperlink: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  export default mongoose.models.AdImage ||
    mongoose.model("AdImage", AdImageSchema);
