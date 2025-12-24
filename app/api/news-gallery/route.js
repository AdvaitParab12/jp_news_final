import { connectDB } from "@/lib/mongodb";
import NewsGallery from "@/models/NewsGallery";

export async function GET() {
  try {
    await connectDB();
    const items = await NewsGallery.find().sort({ createdAt: -1 }).lean();

    const normalized = items.map((n) => ({
      ...n,
      _id: n._id.toString(),
      createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : null,
      updatedAt: n.updatedAt ? new Date(n.updatedAt).toISOString() : null,
    }));

    return new Response(JSON.stringify(normalized), { status: 200 });
  } catch (error) {
    console.error("GET /api/news-gallery error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.videoUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: title or videoUrl" }),
        { status: 400 }
      );
    }

    const result = await NewsGallery.create({
      title: body.title,
      description: body.description || "",
      videoUrl: body.videoUrl,
      createdBy: body.createdBy || "",
      // date: body.date || new Date().toISOString().split("T")[0],
      image: body.image || undefined,
    });

    return new Response(JSON.stringify({ insertedId: result._id.toString() }), {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/news-gallery error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
