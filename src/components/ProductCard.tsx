import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onViewDetails: () => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-card rounded-2xl border border-border shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist();
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all duration-200 hover:scale-110"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? 'fill-primary text-primary' : 'text-muted-foreground'
          }`}
        />
      </button>

      {/* Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="destructive">Out of Stock</Badge>
        </div>
      )}

      {/* Product Image */}
      <div
        onClick={onViewDetails}
        className="relative aspect-square overflow-hidden cursor-pointer bg-muted"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-foreground">{product.rating}</span>
          <Badge variant="secondary" className="ml-2 text-xs">
            {product.category}
          </Badge>
        </div>

        <h3
          onClick={onViewDetails}
          className="font-semibold text-lg mb-2 text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gradient">₹{product.price.toFixed(2)}</span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-muted-foreground">Only {product.stock} left</span>
            )}
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            disabled={isOutOfStock}
            size="icon"
            className="rounded-full h-11 w-11 shadow-lg hover:shadow-hover transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
