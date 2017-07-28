function transformToCloudinaryImages(sourceImage) {
  const thumbnailImage = sourceImage.replace(/upload\//, 'upload/c_fill,g_west,h_150,w_150/');
  const standardImage = sourceImage;

  return { thumbnail: thumbnailImage, standard: standardImage };
}

module.exports = transformToCloudinaryImages;
