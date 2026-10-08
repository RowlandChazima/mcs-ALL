export function getOptimizedCloudinaryUrl(
  publicIdOrUrl: string,
  options?: { width?: number; quality?: string | number },
): string {
  const width = options?.width ?? 1200;
  const quality = options?.quality ?? "auto";
  const transform = `f_auto,q_${quality},w_${width}`;

  // Already a full Cloudinary URL: inject the optimisation flags.
  if (publicIdOrUrl.startsWith("http")) {
    return publicIdOrUrl.replace("/upload/", `/upload/${transform}/`);
  }

  // Only a public ID stored in the database: build the URL ourselves.
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicIdOrUrl}`;
}
