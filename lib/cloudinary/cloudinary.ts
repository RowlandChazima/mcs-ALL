export function getOptimizedCloudinaryUrl(
  publicIdOrUrl: string,
  options?: { width?: number; quality?: string | number },
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const width = options?.width || 1200;
  const quality = options?.quality || "auto";

  // If it's already a full URL from Cloudinary:
  if (publicIdOrUrl.startsWith("http")) {
    return publicIdOrUrl.replace(
      "/upload/",
      `/upload/f_auto,q_${quality},w_${width}/`,
    );
  }

  // If you only store the public ID (cleaner in database):
  return `[https://res.cloudinary.com/$](https://res.cloudinary.com/$){cloudName}/image/upload/f_auto,q_${quality},w_${width}/${publicIdOrUrl}`;
}
