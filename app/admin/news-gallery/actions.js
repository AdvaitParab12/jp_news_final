"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import NewsGallery from "@/models/NewsGallery";

function serializeDocument(doc) {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc));
}

export async function getNewsGallery() {
  await connectDB();
  const items = await NewsGallery.find().sort({ createdAt: -1 }).lean();
  return items.map((i) => serializeDocument(i));
}

export async function addNewsGallery(payload) {
  await connectDB();
  const item = await NewsGallery.create(payload);
  revalidatePath("/admin");
  revalidatePath("/api/news-gallery");
  return serializeDocument(item.toObject());
}

export async function updateNewsGallery(id, payload) {
  await connectDB();
  await NewsGallery.findByIdAndUpdate(id, payload);
  revalidatePath("/admin");
  revalidatePath("/api/news-gallery");
  return true;
}

export async function deleteNewsGallery(id) {
  await connectDB();
  await NewsGallery.findByIdAndDelete(id);
  revalidatePath("/admin");
  revalidatePath("/api/news-gallery");
  return true;
}
