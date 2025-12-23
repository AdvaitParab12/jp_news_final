"use server";

import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import StaticAd from "@/models/StaticAd";

/**
 * Fetch current static ad image
 */
export async function getStaticAdImage() {
  await connectDB();

  const ad = await StaticAd.findOne().lean();
  return ad ? ad.imageUrl : null;
}

/**
 * Upload or update static ad image
 */
export async function uploadOrUpdateStaticAd(_, formData) {
  try {
    await connectDB();

    const file = formData.get("image");
    if (!file || !file.size) return { success: false };

    // convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // find existing ad
    const existingAd = await StaticAd.findOne();

    // delete old image from Cloudinary
    if (existingAd?.publicId) {
      await cloudinary.uploader.destroy(existingAd.publicId);
    }

    // upload new image
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "static-ads",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    // upsert MongoDB record
    await StaticAd.findOneAndUpdate(
      {},
      {
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
      { upsert: true, new: true }
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
