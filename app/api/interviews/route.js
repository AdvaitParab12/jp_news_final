import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";

export async function GET() {
  try {
    await connectDB();
    const items = await Interview.find().sort({ createdAt: -1 }).lean();

    const normalized = items.map((i) => ({
      ...i,
      _id: i._id.toString(),
      thumbnail:
        typeof i.thumbnail === "string"
          ? { url: i.thumbnail }
          : i.thumbnail ?? null,
      createdBy: i.createdBy || "",
      createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : null,
      updatedAt: i.updatedAt ? new Date(i.updatedAt).toISOString() : null,
    }));

    return new Response(JSON.stringify(normalized), { status: 200 });
  } catch (error) {
    console.error("GET /api/interviews error:", error);
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
    if (!body.videoUrl) missing.push("videoUrl");
    if (missing.length) {
      return new Response(
        JSON.stringify({
          error: `Missing required field(s): ${missing.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    let thumbData;
    if (typeof body.thumbnail === "string") {
      thumbData = { url: body.thumbnail };
    } else if (body.thumbnail && typeof body.thumbnail === "object") {
      thumbData = { ...body.thumbnail };
    } else {
      thumbData = undefined;
    }

    if (
      body.thumbnailPublicId ||
      body.thumbnailTitle ||
      body.thumbnailDescription
    ) {
      thumbData = thumbData || {};
      if (body.thumbnailPublicId) thumbData.public_id = body.thumbnailPublicId;
      if (body.thumbnailTitle) thumbData.title = body.thumbnailTitle;
      if (body.thumbnailDescription)
        thumbData.description = body.thumbnailDescription;
    }

    const result = await Interview.create({
      title: body.title,
      excerpt: body.excerpt || "",
      createdBy: body.createdBy || "",
      videoUrl: body.videoUrl,
      thumbnail: thumbData,
      date: body.date || new Date().toISOString().split("T")[0],
    });

    return new Response(JSON.stringify({ insertedId: result._id.toString() }), {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/interviews error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
