/**
 * Transforms a raw Cloudinary URL to add optimization parameters.
 * - `f_auto`: Automatically select the best format (WebP, AVIF) supported by the browser.
 * - `q_auto`: Automatically compress the image with minimal quality loss.
 * - `w_width`: Resize the image to the specified width to avoid transferring bloated pixels.
 * 
 * @param {string} url - The original Cloudinary URL
 * @param {number} width - The target display width in pixels (defaults to 800)
 * @returns {string} The optimized image URL
 */
export function getOptimizedCloudinaryUrl(url, width = 800) {
  if (!url) return '';

  // Return as-is if it's not a Cloudinary image (e.g. Unsplash placeholder, local asset)
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const uploadSegment = '/upload/';
  const uploadIndex = url.indexOf(uploadSegment);

  if (uploadIndex === -1) {
    return url;
  }

  // Split the URL around the '/upload/' segment
  const prefix = url.substring(0, uploadIndex + uploadSegment.length);
  let suffix = url.substring(uploadIndex + uploadSegment.length);

  // Remove any legacy inline transformations (e.g. upload/w_400,c_scale/v123... -> upload/v123...)
  // They are characterized by a comma or letter-coded params followed by a slash prior to the version 'v123...'
  const slashIndex = suffix.indexOf('/');
  if (slashIndex !== -1) {
    const firstPart = suffix.substring(0, slashIndex);
    // If the first part contains letters followed by underscore (e.g., w_, q_, f_, c_), it is a transformation segment
    if (/^[a-z]_[a-zA-Z0-9,_]+$/.test(firstPart)) {
      suffix = suffix.substring(slashIndex + 1);
    }
  }

  // Inject optimization and size parameters
  return `${prefix}f_auto,q_auto,w_${width},c_limit/${suffix}`;
}
