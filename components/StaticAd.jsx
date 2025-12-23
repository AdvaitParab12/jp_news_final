import Image from "next/image";
import { getStaticAdImage } from "@/app/admin/static-ad/actions";

export default async function Advertisement() {
  const imageUrl = await getStaticAdImage();

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt="Advertisement"
      width={728}
      height={90}
      className="img-responsive"
      priority
    />
  );
}
