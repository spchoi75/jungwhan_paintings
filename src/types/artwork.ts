export interface Category {
  id: string;
  name: string;
  name_en: string | null;
  slug: string;
  description: string | null;
  description_en: string | null;
  cover_image_url: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Artwork {
  id: string;
  title: string;
  title_en: string | null;
  year: number;
  width: number | null;
  height: number | null;
  medium: string | null;
  description: string | null;
  description_en: string | null;
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
  title_en?: string;
  year: number;
  width?: number;
  height?: number;
  medium?: string;
  description?: string;
  description_en?: string;
  is_featured: boolean;
  category_id?: string;
}

export interface CategoryFormData {
  name: string;
  name_en?: string;
  slug: string;
  description?: string;
  description_en?: string;
}

export interface EducationItem {
  year: string;
  description: string;
  description_en?: string;
}

export interface ExhibitionItem {
  year: string;
  description: string;
  description_en?: string;
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'website' | 'other';
  url: string;
  label?: string;
}

export interface AboutInfo {
  id: string;
  artist_name: string;
  artist_name_en: string | null;
  bio_paragraphs: string[];
  bio_paragraphs_en: string[];
  footer_bio: string | null;
  footer_bio_en: string | null;
  education: EducationItem[];
  exhibitions: ExhibitionItem[];
  contact_email: string | null;
  contact_phone: string | null;
  phone_visible: boolean;
  social_links: SocialLink[];
  profile_image_url: string | null;
  cv_file_url: string | null;
  updated_at: string;
}

export interface AboutFormData {
  artist_name: string;
  artist_name_en?: string;
  bio_paragraphs: string[];
  bio_paragraphs_en?: string[];
  footer_bio?: string;
  footer_bio_en?: string;
  education: EducationItem[];
  exhibitions: ExhibitionItem[];
  contact_email?: string;
  contact_phone?: string;
  phone_visible?: boolean;
  social_links?: SocialLink[];
  profile_image_url?: string;
  cv_file_url?: string;
}

// Exhibition page types
export interface Exhibition {
  id: string;
  title: string;
  title_en: string | null;
  venue: string;
  venue_en: string | null;
  location: string | null;
  location_en: string | null;
  year: number;
  type: 'solo' | 'group';
  external_url: string | null;
  display_order: number;
  created_at: string;
}

export interface ExhibitionFormData {
  title: string;
  title_en?: string;
  venue: string;
  venue_en?: string;
  location?: string;
  location_en?: string;
  year: number;
  type: 'solo' | 'group';
  external_url?: string;
  display_order?: number;
}
