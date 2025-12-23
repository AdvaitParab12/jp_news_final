import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title") || "";
    const description = formData.get("description") || "";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const options = {
        folder: "uploads",
      };
      // pass context so Cloudinary resource retains title/description if needed
      if (title || description) {
        options.context = `title=${title}|description=${description}`;
      }

      cloudinary.uploader
        .upload_stream(options, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(buffer);
    });

    return new Response(
      JSON.stringify({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
