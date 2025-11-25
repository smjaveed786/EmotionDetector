import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecommendationsProps {
  title: string;
  products: Product[];
  currentProductId?: string;
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  wishlistedProducts: Set<string>;
}

export function Recommendations({
  title,
  products,
  currentProductId,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  wishlistedProducts
}: RecommendationsProps) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  
  // Filter out current product if provided
  const filteredProducts = currentProductId 
    ? products.filter(p => p.id !== currentProductId)
    : products;

  const visibleProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + itemsPerPage < filteredProducts.length;

  const scrollLeft = () => {
    setStartIndex(Math.max(0, startIndex - itemsPerPage));
  };

  const scrollRight = () => {
    setStartIndex(Math.min(filteredProducts.length - itemsPerPage, startIndex + itemsPerPage));
  };

  if (filteredProducts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={startIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistedProducts.has(product.id)}
                onToggleWishlist={() => onToggleWishlist(product.id)}
                onAddToCart={() => onAddToCart(product.id)}
                onViewDetails={() => onViewDetails(product.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
