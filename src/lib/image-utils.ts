/**
 * Utility to optimize external and CDN image URLs for high performance.
 * Dynamically adjusts width and quality parameters for Unsplash images
 * so that small UI cards download compact, crisp thumbnails (10-30KB)
 * instead of uncompressed multi-megabyte 4K source assets.
 */
export function getOptimizedImageUrl(
  url?: string,
  width: number = 600,
  quality: number = 75
): string {
  if (!url || typeof url !== "string") {
    return "/placeholder-image.jpg";
  }

  // Handle Unsplash images
  if (url.includes("images.unsplash.com")) {
    let optimized = url;
    if (optimized.includes("w=")) {
      optimized = optimized.replace(/([?&])w=\d+/, `$1w=${width}`);
    } else {
      optimized += (optimized.includes("?") ? "&" : "?") + `w=${width}`;
    }

    if (optimized.includes("q=")) {
      optimized = optimized.replace(/([?&])q=\d+/, `$1q=${quality}`);
    } else {
      optimized += `&q=${quality}`;
    }

    if (!optimized.includes("auto=format")) {
      optimized += "&auto=format";
    }

    if (!optimized.includes("fit=crop")) {
      optimized += "&fit=crop";
    }

    return optimized;
  }

  return url;
}
