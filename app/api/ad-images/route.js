import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AdImage from "@/models/AdImages";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (!section) {
      return NextResponse.json(
        { error: "Section parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const images = await AdImage.find({ section })
      .sort({ createdAt: 1 })
      .lean();

    // Serialize the data to convert ObjectIds to strings
    const serializedImages = images.map((img) => ({
      ...img,
      _id: img._id.toString(),
    }));

    return NextResponse.json(serializedImages);
  } catch (error) {
    console.error("Error fetching ad images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
    console.log("RAW DB DOC:", images[0]);
  }
}