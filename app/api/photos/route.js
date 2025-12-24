export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();
    console.log("GET -> DB:", mongoose.connection.name);
    const db = mongoose.connection.db;

    const photos = await db
      .collection("photos")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify(photos), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id)
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
      });

    await connectDB();
    const db = mongoose.connection.db;
    const photos = db.collection("photos");

    const _id = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    if (!_id)
      return new Response(JSON.stringify({ error: "Invalid id" }), {
        status: 400,
      });

    const doc = await photos.findOne({ _id });
    if (!doc)
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });

    // remove from Cloudinary if public_id exists
    if (doc.public_id) {
      try {
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(doc.public_id, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      } catch (err) {
        console.error("Cloudinary destroy failed:", err);
      }
    }

    await photos.deleteOne({ _id });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
