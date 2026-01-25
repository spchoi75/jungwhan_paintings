'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/artwork';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">No categories yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Responsive grid: 2 cols (mobile) → 3 cols (tablet) → 4 cols (desktop) → 5 cols (large) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/artworks/${category.slug}`}
            className="group block aspect-square relative overflow-hidden bg-gray-800"
          >
            {/* Image */}
            {category.cover_image_url ? (
              <Image
                src={category.cover_image_url}
                alt={category.name}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <span className="text-gray-500 text-4xl font-light">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Category name (visible on hover) */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span className="text-white text-center text-sm md:text-base font-light tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
