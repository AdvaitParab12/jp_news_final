"use server";

import { connectDB } from "@/lib/mongodb";
import News from "@/models/LocalNews";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

/* READ */
export async function getNews() {
  await connectDB();
  const news = await News.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(news));
}

/* CREATE */
export async function addNews(formData) {
  try {
    await connectDB();

    const file = formData.get("image");
    if (!file || !file.size) {
      throw new Error("Image file is required");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "local-news" },
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        )
        .end(buffer);
    });

    await News.create({
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      category: formData.get("category"),
      date: formData.get("date"),
      image: {
        url: upload.secure_url,
        public_id: upload.public_id,
      },
    });

    revalidatePath("/admin/local-news");
  } catch (error) {
    console.error("Add news error:", error);
    throw error;
  }
}

/* UPDATE */
export async function updateNews(id, formData) {
  try {
    await connectDB();
    const news = await News.findById(id);
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
          .upload_stream(
            { folder: "local-news" },
            (err, res) => {
              if (err) reject(err);
              else resolve(res);
            }
          )
          .end(buffer);
      });

      imageData = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    await News.findByIdAndUpdate(id, {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      category: formData.get("category"),
      date: formData.get("date"),
      image: imageData,
    });

    revalidatePath("/admin/local-news");
  } catch (error) {
    console.error("Update news error:", error);
    throw error;
  }
}

/* DELETE */
export async function deleteNews(id) {
  await connectDB();

  const news = await News.findById(id);
  if (news.image?.public_id) {
    await cloudinary.uploader.destroy(news.image.public_id);
  }

  await News.findByIdAndDelete(id);
  revalidatePath("/admin/local-news");
}
