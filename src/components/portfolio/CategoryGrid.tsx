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
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/portfolio/${category.slug}`}
          className="group block"
        >
          <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
            {category.cover_image_url ? (
              <Image
                src={category.cover_image_url}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-300 text-6xl font-light">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-lg tracking-wide font-light group-hover:text-gray-600 transition-colors">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-sm text-gray-500 mt-1">
                {category.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
