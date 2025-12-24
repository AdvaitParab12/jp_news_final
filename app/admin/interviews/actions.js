"use server";

import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

/* READ */
export async function getInterviews() {
  await connectDB();
  const items = await Interview.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

/* CREATE */
export async function addInterview(formData) {
  try {
    await connectDB();

    const file = formData.get("thumbnail");
    if (!file || !file.size) {
      throw new Error("Thumbnail image is required");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "interviews" }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });

    await Interview.create({
      title: formData.get("title"),
      excerpt: formData.get("excerpt") || "",
      videoUrl: formData.get("videoUrl"),
      thumbnail: {
        url: upload.secure_url,
        public_id: upload.public_id,
      },
      // date: formData.get("date") || new Date().toISOString().split("T")[0],
    });

    revalidatePath("/admin");
  } catch (error) {
    console.error("Add interview error:", error);
    throw error;
  }
}

/* UPDATE */
export async function updateInterview(id, formData) {
  try {
    await connectDB();
    const item = await Interview.findById(id);
    if (!item) {
      throw new Error("Interview not found");
    }

    let thumbData = item.thumbnail;

    const file = formData.get("thumbnail");
    if (file && file.size > 0) {
      if (item.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(item.thumbnail.public_id);
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "interviews" }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          })
          .end(buffer);
      });

      thumbData = { url: upload.secure_url, public_id: upload.public_id };
    }

    await Interview.findByIdAndUpdate(id, {
      title: formData.get("title"),
      excerpt: formData.get("excerpt") || "",
      videoUrl: formData.get("videoUrl"),
      // date: formData.get("date") || item.date,
      createdBy: formData.get("createdBy") || item.createdBy,
      thumbnail: thumbData,
    });

    revalidatePath("/admin");
  } catch (error) {
    console.error("Update interview error:", error);
    throw error;
  }
}

/* DELETE */
export async function deleteInterview(id) {
  await connectDB();

  const item = await Interview.findById(id);
  if (item.thumbnail?.public_id) {
    await cloudinary.uploader.destroy(item.thumbnail.public_id);
  }

  await Interview.findByIdAndDelete(id);
  revalidatePath("/admin");
}
