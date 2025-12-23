"use server";

import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import AdImage from "@/models/AdImages";
import { revalidatePath } from "next/cache";

// export async function uploadImage(prevState, formData) {
//   try {
//     const file = formData.get("image");
//     const section = formData.get("section");

//     if (!file || !section) {
//       return { success: false, error: "File and section are required" };
//     }

//     await connectDB();

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             folder: `ads/${section}`,
//           },
//           (err, res) => {
//             if (err) reject(err);
//             else resolve(res);
//           }
//         )
//         .end(buffer);
//     });

//     await AdImage.create({
//       section,
//       url: result.secure_url,
//       publicId: result.public_id,
//     });

//     revalidatePath("/");
//     revalidatePath("/admin");
//     return { success: true };
//   } catch (err) {
//     console.error("Upload error:", err);
//     return { success: false, error: err.message || "Failed to upload image" };
//   }
// }
export async function uploadImage(prevState, formData) {
  try {
    const file = formData.get("image");
    const section = formData.get("section");

    if (!file || !section) {
      return { success: false, error: "File and section are required" };
    }

    const originalName = file.name; // ✅ capture filename

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
      originalName, // ✅ store it
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
    const originalName = file ? file.name : null;

    if (!file || !imageId) {
      return { success: false, error: "File and image ID are required" };
    }

    await connectDB();

    const image = await AdImage.findById(imageId);
    if (!image) {
      return { success: false, error: "Image not found" };
    }

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
    image.originalName = originalName;
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
