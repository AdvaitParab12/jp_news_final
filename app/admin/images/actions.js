"use server";

import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import AdImage from "@/models/AdImages";
import { revalidatePath } from "next/cache";
export async function uploadImage(formData) {
  try {
    const file = formData.get("image");
    const section = formData.get("section");
    const title = formData.get("title");
    const hyperlink = formData.get("hyperlink");

    if (!file || !section) {
      return { success: false, error: "File and section are required" };
    }

    const originalName = file.name;

    await connectDB();

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: `ads/${section}` }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });

    await AdImage.create({
      section,
      url: result.secure_url,
      publicId: result.public_id,
      originalName,
      title,
      hyperlink,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, error: err.message };
  }
}
export async function updateImage(prevState, formData) {
  try {
    const file = formData.get("image");
    const imageId = formData.get("imageId");
    const title = formData.get("title");
    const hyperlink = formData.get("hyperlink");

    if (!imageId) {
      return { success: false, error: "Image ID is required" };
    }

    await connectDB();

    const image = await AdImage.findById(imageId);
    if (!image) {
      return { success: false, error: "Image not found" };
    }

    // Update metadata
    if (title !== null) image.title = title;
    if (hyperlink !== null) image.hyperlink = hyperlink;

    // If a new file is provided, upload it and replace the old one
    if (file && file.size > 0) {
      // delete old image from Cloudinary
      await cloudinary.uploader.destroy(image.publicId);

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: `ads/${image.section}` }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          })
          .end(buffer);
      });

      image.url = result.secure_url;
      image.publicId = result.public_id;
      image.originalName = file.name;
    }

    await image.save();

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error("Update error:", err);
    return { success: false, error: err.message || "Failed to update image" };
  }
}
export async function deleteImage(formData) {
  try {
    const imageId = formData.get("imageId");
    if (!imageId) return { success: false };

    await connectDB();

    const image = await AdImage.findById(imageId);
    if (!image) return { success: false };

    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
