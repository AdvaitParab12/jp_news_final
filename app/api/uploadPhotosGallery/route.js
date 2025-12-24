export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const title = form.get("title") || "";
    const alt = form.get("alt") || "";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "news-project" }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(buffer);
    });

    await connectDB();
    const db = mongoose.connection.db;
    const photos = db.collection("photos");

    const doc = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      title,
      alt,
      createdAt: new Date(),
    };

    const result = await photos.insertOne(doc);
    console.log("Inserted:", result.insertedId.toString());

    return new Response(JSON.stringify({ ok: true, doc }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
