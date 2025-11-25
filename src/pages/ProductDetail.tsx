import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PRODUCTS, QUESTIONS } from '@/data/products';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BuyBox } from '@/components/BuyBox';
import { ProductReviews } from '@/components/ProductReviews';
import { Recommendations } from '@/components/Recommendations';
import { Background3D } from '@/components/Background3D';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShoppingCart, Zap, Package, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CartState } from '@/types/product';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useLocalStorage<CartState>('shopx_cart', { items: {} });
  const [wishlistArray, setWishlistArray] = useLocalStorage<string[]>('shopx_wishlist', []);
  const wishlist = new Set(wishlistArray);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background3D />
        <div className="text-center space-y-4 relative z-10">
          <h1 className="text-4xl font-bold">Product Not Found</h1>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  const productQuestions = QUESTIONS.filter(q => q.productId === id);
  const relatedProducts = PRODUCTS.filter(p => 
    p.category === product.category && p.id !== product.id
  );

  const handleAddToCart = (quantity: number) => {
    const existingItem = cart.items[product.id];
    const newQuantity = (existingItem?.quantity || 0) + quantity;

    setCart({
      items: {
        ...cart.items,
        [product.id]: {
          product,
          quantity: Math.min(newQuantity, product.stock)
        }
      }
    });
  };

  const handleToggleWishlist = () => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(product.id)) {
      newWishlist.delete(product.id);
      toast.success('Removed from wishlist');
    } else {
      newWishlist.add(product.id);
      toast.success('Added to wishlist');
    }
    setWishlistArray(Array.from(newWishlist));
  };

  const cartCount = Object.values(cart.items).reduce((sum, item) => sum + item.quantity, 0);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-accent text-accent' : 'text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Background3D />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-glass-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.h1
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-gradient cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            ShopX
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Breadcrumbs 
          items={[
            { label: product.category, path: `/?category=${product.category}` },
            { label: product.title, path: `/product/${product.id}` }
          ]} 
        />

        {/* Product Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-card p-6">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </Card>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isBestSeller && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3" />
                  Best Seller
                </Badge>
              )}
              {product.isPrime && (
                <Badge variant="secondary" className="gap-1">
                  <Zap className="h-3 w-3" />
                  Prime
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="destructive" className="gap-1">
                  <Package className="h-3 w-3" />
                  Low Stock
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Brand: {product.brand}</p>
                <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
                <div className="flex items-center gap-3">
                  {renderStars(product.rating)}
                  <span className="text-sm text-muted-foreground">
                    {product.rating} out of 5
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-sm text-accent font-medium">
                    {product.reviewCount.toLocaleString()} ratings
                  </span>
                </div>
              </div>

              <Separator />

              {/* Key Specs */}
              <div>
                <h3 className="font-semibold mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-1">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3">About this item:</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="lg:col-span-1">
            <BuyBox
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.has(product.id)}
            />
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Card className="glass-card p-6 mb-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
              <TabsTrigger value="qa">Questions & Answers</TabsTrigger>
              <TabsTrigger value="details">Product Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product.id}
                averageRating={product.rating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>
            
            <TabsContent value="qa" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Questions & Answers</h3>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>
                </div>

                {productQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {productQuestions.map((qa) => (
                      <Card key={qa.id} className="glass-card p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">Q: {qa.question}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              by {qa.userName} on {new Date(qa.date).toLocaleDateString()}
                            </p>
                          </div>
                          {qa.answer && (
                            <div className="pl-4 border-l-2 border-accent">
                              <p className="text-sm text-muted-foreground">A: {qa.answer}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                by {qa.answeredBy}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card p-8 text-center">
                    <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Brand</p>
                    <p className="font-semibold">{product.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="font-semibold">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                    <p className="font-semibold">{product.stock} units</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivery</p>
                    <p className="font-semibold">{product.deliveryDays} days</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Technical Specifications</p>
                  <ul className="space-y-1">
                    {product.specs.map((spec, index) => (
                      <li key={index} className="text-sm">{spec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Recommendations */}
        <Recommendations
          title="Customers who viewed this also viewed"
          products={relatedProducts}
          currentProductId={product.id}
          onAddToCart={(productId) => {
            const p = PRODUCTS.find(pr => pr.id === productId);
            if (p) {
              setCart({
                items: {
                  ...cart.items,
                  [productId]: {
                    product: p,
                    quantity: (cart.items[productId]?.quantity || 0) + 1
                  }
                }
              });
              toast.success('Added to cart');
            }
          }}
          onToggleWishlist={(productId) => {
            const newWishlist = new Set(wishlist);
            if (newWishlist.has(productId)) {
              newWishlist.delete(productId);
              toast.success('Removed from wishlist');
            } else {
              newWishlist.add(productId);
              toast.success('Added to wishlist');
            }
            setWishlistArray(Array.from(newWishlist));
          }}
          onViewDetails={(productId) => navigate(`/product/${productId}`)}
          wishlistedProducts={wishlist}
        />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cart={cart}
        onUpdateQuantity={(productId, quantity) => {
          if (quantity === 0) {
            const newItems = { ...cart.items };
            delete newItems[productId];
            setCart({ items: newItems });
          } else {
            setCart({
              items: {
                ...cart.items,
                [productId]: { ...cart.items[productId], quantity }
              }
            });
          }
        }}
        onRemoveItem={(productId) => {
          const newItems = { ...cart.items };
          delete newItems[productId];
          setCart({ items: newItems });
        }}
      />
    </div>
  );
}
