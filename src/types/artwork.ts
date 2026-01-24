export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Artwork {
  id: string;
  title: string;
  year: number;
  width: number | null;
  height: number | null;
  medium: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string;
  is_featured: boolean;
  order: number;
  category_id: string | null;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ArtworkFormData {
  title: string;
  year: number;
  width?: number;
  height?: number;
  medium?: string;
  description?: string;
  is_featured: boolean;
  category_id?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
}
