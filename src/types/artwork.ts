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
}
