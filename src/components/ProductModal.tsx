import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}

export function ProductModal({
  product,
  open,
  onOpenChange,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductModalProps) {
  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {isOutOfStock && (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="text-base px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Rating & Category */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
              </div>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            {/* Price */}
            <div>
              <span className="text-4xl font-bold text-gradient">₹{product.price.toFixed(2)}</span>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Only {product.stock} left in stock
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={onAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="flex-1 rounded-xl shadow-lg hover:shadow-hover transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                onClick={onToggleWishlist}
                variant={isWishlisted ? 'default' : 'outline'}
                size="lg"
                className="rounded-xl"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
