import { connectDB } from "@/lib/mongodb";
import News from "@/models/LocalNews";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    await connectDB();

    let dbItem = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      dbItem = await News.findById(id).lean();
    }

    if (!dbItem) {
      return new Response(JSON.stringify({ error: "News not found" }), {
        status: 404,
      });
    }

    const item = {
      ...dbItem,
      _id: dbItem._id.toString(),
      image:
        typeof dbItem.image === "object" && dbItem.image?.url
          ? dbItem.image.url
          : dbItem.image || "",
      createdAt: dbItem.createdAt
        ? new Date(dbItem.createdAt).toISOString()
        : null,
      updatedAt: dbItem.updatedAt
        ? new Date(dbItem.updatedAt).toISOString()
        : null,
    };

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (error) {
    console.error("GET /api/news/[id] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    // Handle image - convert string URL to object format if needed
    let imageData = body.image;
    if (typeof body.image === "string") {
      imageData = { url: body.image };
    }

    const result = await News.findByIdAndUpdate(
      id,
      {
        title: body.title,
        excerpt: body.excerpt,
        image: imageData,
        category: body.category || "",
        // date: body.date || new Date().toISOString().split("T")[0],
      },
      { new: true }
    );

    if (!result) {
      return new Response(JSON.stringify({ error: "News not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Updated" }), {
      status: 200,
    });
  } catch (error) {
    console.error("PUT /api/news/[id] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    await connectDB();

    const result = await News.findByIdAndDelete(id);

    if (!result) {
      return new Response(JSON.stringify({ error: "News not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("DELETE /api/local-news/[id] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
