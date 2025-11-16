

export interface Photo {
  id: string;
  title: string;
  date: string;
  url: string;
  urls?: {
    small: string;
    medium: string;
    large: string;
  };
  description: string | null;
  base64Data?: string;
  mimeType?: string;
  tags?: string[];
  rating?: number;
  // Detailed metadata
  width?: number;
  height?: number;
  fileSize?: number; // in MB
  iso?: string;
  aperture?: string;
  exposureTime?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  imageUrl: string;
  tags?: string[];
  // likes: number;
}

export interface Comment {
  id: string;
  postId: string; // Corresponds to BlogPost slug
  author: string;
  email: string;
  content: string;
  date: string;
  // upvotes: number;
  parentId?: string; // ID of the parent comment for threading
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isLoading?: boolean;
}

export interface NewBlogPostData {
  title: string;
  excerpt: string;
  imageUrl: string;
  content: string;
}

export interface ObjectOfTheMonthData {
  name: string;
  imageUrl: string;
  description: string;
  facts: {
    label: string;
    value: string;
  }[];
  findingTips: string;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error';
}

export enum View {
  GALLERY = 'gallery',
  BLOG = 'blog',
  BLOG_POST = 'blog_post',
  STARGAZING = 'stargazing',
}

export enum SortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RATING = 'rating',
  TITLE = 'title',
}