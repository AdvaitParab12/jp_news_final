import "server-only";
import { connectDB } from "@/lib/mongodb";
import AdImage from "@/models/AdImages";

export async function getAdImages(section) {
  await connectDB();
  return AdImage.find({ section }).sort({ createdAt: 1 }).lean();
}
