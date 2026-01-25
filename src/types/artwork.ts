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

export interface EducationItem {
  year: string;
  description: string;
}

export interface ExhibitionItem {
  year: string;
  description: string;
}

export interface AboutInfo {
  id: string;
  artist_name: string;
  bio_paragraphs: string[];
  education: EducationItem[];
  exhibitions: ExhibitionItem[];
  contact_email: string | null;
  profile_image_url: string | null;
  cv_file_url: string | null;
  updated_at: string;
}

export interface AboutFormData {
  artist_name: string;
  bio_paragraphs: string[];
  education: EducationItem[];
  exhibitions: ExhibitionItem[];
  contact_email?: string;
  profile_image_url?: string;
  cv_file_url?: string;
}

// Exhibition page types
export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  location: string | null;
  year: number;
  type: 'solo' | 'group';
  external_url: string | null;
  display_order: number;
  created_at: string;
}

export interface ExhibitionFormData {
  title: string;
  venue: string;
  location?: string;
  year: number;
  type: 'solo' | 'group';
  external_url?: string;
  display_order?: number;
}
