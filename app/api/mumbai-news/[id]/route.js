import { connectDB } from "@/lib/mongodb";
import MumbaiNews from "@/models/MumbaiNews";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    let imageData = body.image;
    if (typeof body.image === "string") {
      imageData = { url: body.image };
    }

    const result = await MumbaiNews.findByIdAndUpdate(
      id,
      {
        title: body.title,
        excerpt: body.excerpt,
        image: imageData,
        category: body.category || "",
        date: body.date || new Date().toISOString().split("T")[0],
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
    console.error("PUT /api/mumbai-news/[id] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    await connectDB();

    const result = await MumbaiNews.findByIdAndDelete(id);

    if (!result) {
      return new Response(JSON.stringify({ error: "News not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("DELETE /api/mumbai-news/[id] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
