export type ImageItem = {
  objectId: string;
  displayName: string;
  ra: number;
  dec: number;
  constellation: string;
  imageFilename: string;
  height: number;
  width: number;
};

export type NormalizedImage = ImageItem & {
  id: string;
  srcOriginal: string;
  srcThumb: string;
  srcThumb640: string;
  srcThumb1080: string;
};

export type ArticleMetadata = {
  title: string;
  date: string;
  description: string;
  ogImage?: string;
};

export type Article = {
  slug: string;
  metadata: ArticleMetadata;
  content: string;
};
