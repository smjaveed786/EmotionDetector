import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, Zap, MapPin, Shield, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BuyBoxProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
}

export function BuyBox({ product, onAddToCart, onToggleWishlist, isWishlisted }: BuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    onAddToCart(quantity);
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    onAddToCart(quantity);
    toast.success('Proceeding to checkout...', {
      description: 'This would redirect to checkout in a real app'
    });
  };

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + product.deliveryDays);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Card className="glass-card p-6 sticky top-4">
      <div className="space-y-4">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gradient">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
          {product.isPrime && (
            <Badge variant="secondary" className="mt-2">
              <Zap className="h-3 w-3 mr-1" />
              Prime
            </Badge>
          )}
        </div>

        <Separator />

        {/* Delivery */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-accent mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                {product.isPrime ? 'FREE Prime Delivery' : 'Standard Delivery'}
              </p>
              <p className="text-muted-foreground">
                Get it by <span className="font-semibold text-foreground">{formattedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <Shield className="h-4 w-4 text-accent mt-0.5" />
            <p className="text-muted-foreground">30-day free returns</p>
          </div>
        </div>

        <Separator />

        {/* Stock Status */}
        {isOutOfStock ? (
          <Badge variant="destructive" className="w-full justify-center py-2">
            Out of Stock
          </Badge>
        ) : isLowStock ? (
          <p className="text-sm text-orange-500 font-medium">
            Only {product.stock} left in stock - order soon
          </p>
        ) : (
          <p className="text-sm text-green-600 font-medium">In Stock</p>
        )}

        {/* Quantity Selector */}
        {!isOutOfStock && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full shadow-hover"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          
          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            Buy Now
          </Button>

          <Button
            onClick={onToggleWishlist}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <motion.div
              animate={{ scale: isWishlisted ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                className="h-5 w-5 mr-2" 
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </motion.div>
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
        </div>

        <Separator />

        {/* Additional Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Brand: <span className="text-foreground font-medium">{product.brand}</span></p>
          <p>Sold by: <span className="text-foreground font-medium">{product.brand} Official</span></p>
        </div>
      </div>
    </Card>
  );
}
