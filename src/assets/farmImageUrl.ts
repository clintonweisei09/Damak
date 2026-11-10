const imageUrls = import.meta.glob('./images/*', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

export function farmImageUrl(imagePath: string): string {
  const fileName = imagePath.split('/').pop();
  const imageUrl = fileName && imageUrls[`./images/${fileName}`];

  if (!imageUrl) {
    throw new Error(`Unknown farm image: ${imagePath}`);
  }

  return imageUrl;
}
