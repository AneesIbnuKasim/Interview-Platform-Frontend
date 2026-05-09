import { API_CONFIG } from "../config/app";

export default function formatImageUrl (image, baseUrl = API_CONFIG.imageURL2) {
    if (!image) return "";
    // Case 1: S3 or Cloudinary object
    if (typeof image === "object" && image.url) {
      // If already absolute (S3), return as-is
      return image.url.startsWith("https")
        ? image.url
        : `${baseUrl}${image.url}`
    }

    // Case 1: image array without url
    if (typeof image === "object") {
      // If already absolute (S3), return as-is
      return image[0]?.startsWith("https")
        ? image[0]
        : `${baseUrl}${image[0]}`
    }

    // Case 2: Old string path
    if (typeof image === "string") {
      if(image.startsWith("blob")) {
        return image
      }
      return image.startsWith("https") ? image : `${baseUrl}${image}` ?? `${baseUrl}${image.url}`;
    }

    return "";
  };