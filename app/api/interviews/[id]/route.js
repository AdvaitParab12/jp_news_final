import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await connectDB();

    let item = null;

    // If id looks like a Mongo ObjectId, query by _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      item = await Interview.findById(id).lean();
    }

    // If not found, try treating the param as a videoUrl (decoded)
    if (!item) {
      try {
        const decoded = decodeURIComponent(id);
        item = await Interview.findOne({ videoUrl: decoded }).lean();
      } catch (e) {
        // ignore
      }
    }

    // If still not found, try a looser match using regex on videoUrl
    if (!item) {
      try {
        const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        item = await Interview.findOne({
          videoUrl: { $regex: escaped, $options: "i" },
        }).lean();
      } catch (e) {
        // ignore
      }
    }

    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    const normalized = {
      ...item,
      _id: item._id.toString(),
      thumbnail:
        typeof item.thumbnail === "object" && item.thumbnail?.url
          ? item.thumbnail.url
          : item.thumbnail || "",
      createdBy: item.createdBy || "",
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    };

    return new Response(JSON.stringify(normalized), { status: 200 });
  } catch (error) {
    console.error("GET /api/interviews/[id] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
