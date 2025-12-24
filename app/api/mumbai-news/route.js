import { connectDB } from "@/lib/mongodb";
import MumbaiNews from "@/models/MumbaiNews";

export async function GET() {
  try {
    await connectDB();
    const news = await MumbaiNews.find().sort({ createdAt: -1 }).lean();

    const normalized = news.map((n) => ({
      ...n,
      _id: n._id.toString(),
      image:
        typeof n.image === "object" && n.image?.url
          ? n.image.url
          : n.image || "",
      // createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : null,
      // updatedAt: n.updatedAt ? new Date(n.updatedAt).toISOString() : null,
    }));

    return new Response(JSON.stringify(normalized), { status: 200 });
  } catch (error) {
    console.error("GET /api/mumbai-news error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const missing = [];
    if (!body.title) missing.push("title");
    if (!body.excerpt) missing.push("excerpt");
    if (!body.category) missing.push("category");
    if (missing.length) {
      return new Response(
        JSON.stringify({
          error: `Missing required field(s): ${missing.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    let imageData;
    if (typeof body.image === "string") {
      imageData = { url: body.image };
    } else if (body.image && typeof body.image === "object") {
      imageData = { ...body.image };
    } else {
      imageData = undefined;
    }

    if (body.imagePublicId || body.imageTitle || body.imageDescription) {
      imageData = imageData || {};
      if (body.imagePublicId) imageData.public_id = body.imagePublicId;
      if (body.imageTitle) imageData.title = body.imageTitle;
      if (body.imageDescription) imageData.description = body.imageDescription;
    }

    const result = await MumbaiNews.create({
      title: body.title,
      excerpt: body.excerpt,
      image: imageData,
      category: body.category || "",
      date: body.date || new Date().toISOString().split("T")[0],
    });

    return new Response(JSON.stringify({ insertedId: result._id.toString() }), {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/mumbai-news error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
