import "server-only";
import { connectDB } from "@/lib/mongodb";
import AdImage from "@/models/AdImages";

/**
 * Get all slider images for a section
 * @param {string} section - ad section key (e.g. top-home-ad)
 * @returns {Promise<Array<{_id, url, section}>>}
 */
export async function getSliderImages(section) {
  if (!section) return [];

  try {
    await connectDB();

    const images = await AdImage.find({ section })
      .sort({ createdAt: 1 }) // stable order
      .select("url section title hyperlink")
      .lean();

    return images || [];
  } catch (error) {
    console.error(
      `Error fetching slider images for section ${section}:`,
      error
    );
    return [];
  }
}
