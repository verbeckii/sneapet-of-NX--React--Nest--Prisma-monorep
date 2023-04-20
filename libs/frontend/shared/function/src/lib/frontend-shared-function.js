import { IMG_FOLDER_PATH, CUSTOMIZED_IMAGES } from "@visionarea-admin/frontend/shared/constant";

export const getImagePath = (imageName) => {
  if (!process.env.NX_IMAGE_PATH) return `${IMG_FOLDER_PATH}${imageName}`;
  if (CUSTOMIZED_IMAGES.includes(imageName)) return `${IMG_FOLDER_PATH}${process.env.NX_IMAGE_PATH}${imageName}`;
  return `${IMG_FOLDER_PATH}${imageName}`;
}