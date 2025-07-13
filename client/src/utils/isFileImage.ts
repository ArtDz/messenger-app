export const isFileImage = (filePath: string) => {
  const imageRegex = /\.(jpg|jpeg|png|gif|svg|tif|tiff|webp|avif|heic|ico|heif)$/i
  return imageRegex.test(filePath)
}
