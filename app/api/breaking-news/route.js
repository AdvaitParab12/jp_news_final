import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BreakingNews from "@/models/BreakingNews";

export async function GET() {
  await connectDB();
  const news = await BreakingNews.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(news);
}
