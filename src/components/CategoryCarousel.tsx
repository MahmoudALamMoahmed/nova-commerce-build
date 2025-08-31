import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Category {
  id: string;
  name: string;
}

interface CategoryCarouselProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

// Category images mapping - using food-related images
const getCategoryImage = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('extra') || name.includes('side')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('salad')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('soup')) {
    return 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('rice') || name.includes('noodle')) {
    return 'https://images.unsplash.com/photo-1563379091339-03246963d2a9?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('combo')) {
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('starter') || name.includes('appetizer')) {
    return 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('roll')) {
    return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('maki') || name.includes('sushi')) {
    return 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('nigiri')) {
    return 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('sashimi')) {
    return 'https://images.unsplash.com/photo-1576866209830-589f8715d4dd?w=400&h=400&fit=crop&crop=center';
  }
  
  // Default food image
  return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&crop=center';
};

const CategoryCarousel = ({ categories, selectedCategory, onCategoryChange }: CategoryCarouselProps) => {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="mb-8 relative">
      <Carousel
        dir={` ${isRTL ? 'ltr' : 'ltr'}`}
        opts={{
        align: "start",
        dragFree: true,       // ✅ خلي السحب حر
        containScroll: "trimSnaps", // ✅ يخلي الاسكرول يقف عند آخر عنصر
        slidesToScroll: 1,
        skipSnaps: true,      // ✅ يمنع الرجوع التلقائي
        loop: false,
      }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {/* All Categories Item */}
          <CarouselItem className="pl-1 basis-1/6 sm:basis-1/5 md:basis-1/6 lg:basis-1/8">
            <div 
              className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                !selectedCategory || selectedCategory === 'all' 
                  ? 'opacity-100' 
                  : 'opacity-60 hover:opacity-80'
              }`}
              onClick={() => onCategoryChange('all')}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                !selectedCategory || selectedCategory === 'all'
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border hover:border-primary/50'
              }`}>
                <img
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&crop=center"
                  alt="All Categories"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`text-xs md:text-sm font-medium mt-2 text-center max-w-20 transition-colors duration-200 ${
                !selectedCategory || selectedCategory === 'all'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}>
                {t('products.allCategories')}
              </p>
            </div>
          </CarouselItem>

          {/* Category Items */}
          {categories.map((category) => (
            <CarouselItem key={category.id} className="pl-1 basis-1/6 sm:basis-1/5 md:basis-1/6 lg:basis-1/8">
              <div 
                className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                  selectedCategory === category.id 
                    ? 'opacity-100' 
                    : 'opacity-60 hover:opacity-80'
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border hover:border-primary/50'
                }`}>
                  <img
                    src={getCategoryImage(category.name)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`text-xs md:text-sm font-medium mt-2 text-center max-w-20 transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}>
                  {category.name}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation arrows */}
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;