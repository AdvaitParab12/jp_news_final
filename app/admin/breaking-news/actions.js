"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import BreakingNews from "@/models/BreakingNews";

// Helper function to serialize Mongoose documents
function serializeDocument(doc) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export async function getBreakingNews() {
  await connectDB();
  const news = await BreakingNews.find()
    .sort({ createdAt: -1 })
     .lean();
  return news.map((item) => serializeDocument(item));
}

export async function addBreakingNews(payload) {
  await connectDB();
  const news = await BreakingNews.create(payload);
  revalidatePath("/admin");
  revalidatePath("/api/breaking-news");
  return serializeDocument(news.toObject());
}

export async function updateBreakingNews(id, payload) {
  await connectDB();
  await BreakingNews.findByIdAndUpdate(id, payload);
  revalidatePath("/admin");
  revalidatePath("/api/breaking-news");
  return true;
}

export async function deleteBreakingNews(id) {
  await connectDB();
  await BreakingNews.findByIdAndDelete(id);
  revalidatePath("/admin");
  revalidatePath("/api/breaking-news");
  return true;
}
