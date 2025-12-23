"use server";

import { connectDB } from "@/lib/mongodb";
import MumbaiNews from "@/models/MumbaiNews";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

/* READ */
export async function getMumbaiNews() {
  await connectDB();
  const news = await MumbaiNews.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(news));
}

/* CREATE */
export async function addMumbaiNews(formData) {
  try {
    await connectDB();

    const file = formData.get("image");
    if (!file || !file.size) {
      throw new Error("Image file is required");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "mumbai-news" }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });

    await MumbaiNews.create({
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      category: formData.get("category"),
      date: formData.get("date"),
      image: {
        url: upload.secure_url,
        public_id: upload.public_id,
      },
    });

    revalidatePath("/admin/mumbai-news");
  } catch (error) {
    console.error("Add Mumbai news error:", error);
    throw error;
  }
}

/* UPDATE */
export async function updateMumbaiNews(id, formData) {
  try {
    await connectDB();
    const news = await MumbaiNews.findById(id);
    if (!news) {
      throw new Error("News article not found");
    }

    let imageData = news.image;

    const file = formData.get("image");
    if (file && file.size > 0) {
      if (news.image?.public_id) {
        await cloudinary.uploader.destroy(news.image.public_id);
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "mumbai-news" }, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          })
          .end(buffer);
      });

      imageData = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    await MumbaiNews.findByIdAndUpdate(id, {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      category: formData.get("category"),
      date: formData.get("date"),
      image: imageData,
    });

    revalidatePath("/admin/mumbai-news");
  } catch (error) {
    console.error("Update Mumbai news error:", error);
    throw error;
  }
}

/* DELETE */
export async function deleteMumbaiNews(id) {
  await connectDB();

  const news = await MumbaiNews.findById(id);
  if (news.image?.public_id) {
    await cloudinary.uploader.destroy(news.image.public_id);
  }

  await MumbaiNews.findByIdAndDelete(id);
  revalidatePath("/admin/mumbai-news");
}
