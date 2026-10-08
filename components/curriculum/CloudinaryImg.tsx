import Image from "next/image";

interface CloudinaryImgProps {
  src: string; // Full Cloudinary URL or path
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function CloudinaryImg({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
}: CloudinaryImgProps) {
  // Automatically inject Cloudinary performance flags if it's a Cloudinary URL
  const optimizedSrc = src.includes("cloudinary.com")
    ? src.replace("/upload/", "/upload/f_auto,q_auto,w_1200/")
    : src;

  return (
    <figure className="my-6 space-y-2">
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-canvas shadow-chunky-sm">
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption className="text-center font-mono text-xs font-medium text-ink-muted">
          Figure: {caption}
        </figcaption>
      )}
    </figure>
  );
}
