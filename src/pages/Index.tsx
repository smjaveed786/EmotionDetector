import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Search, Heart } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { Product, CartState, Filters as FiltersType } from '@/types/product';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { Filters } from '@/components/Filters';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Index() {
  const [filters, setFilters] = useState<FiltersType>({
    query: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    inStockOnly: false,
    sort: 'default',
  });

  const [cart, setCart] = useLocalStorage<CartState>('shopx_cart', { items: {} });
  const [wishlist, setWishlist] = useLocalStorage<Record<string, boolean>>('shopx_wishlist', {});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.category)));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      // Search query
      if (filters.query && !product.title.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }

      // Category
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price range
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }

      // Stock
      if (filters.inStockOnly && product.stock === 0) {
        return false;
      }

      return true;
    });

    // Sort
    if (filters.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filters]);

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('This item is out of stock');
      return;
    }

    const currentItem = cart.items[product.id];
    if (currentItem && currentItem.quantity >= product.stock) {
      toast.error('Cannot add more - stock limit reached');
      return;
    }

    setCart({
      items: {
        ...cart.items,
        [product.id]: {
          product,
          quantity: currentItem ? currentItem.quantity + 1 : 1,
        },
      },
    });

    toast.success('Added to cart!');
    
    // Confetti celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0ea5e3', '#06b6d4', '#10b981'],
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const item = cart.items[productId];
    if (!item) return;

    if (newQuantity > item.product.stock) {
      toast.error('Cannot add more - stock limit reached');
      return;
    }

    setCart({
      items: {
        ...cart.items,
        [productId]: { ...item, quantity: newQuantity },
      },
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    const newItems = { ...cart.items };
    delete newItems[productId];
    setCart({ items: newItems });
    toast.success('Removed from cart');
  };

  const handleToggleWishlist = (productId: string) => {
    const newWishlist = { ...wishlist };
    if (newWishlist[productId]) {
      delete newWishlist[productId];
      toast.success('Removed from wishlist');
    } else {
      newWishlist[productId] = true;
      toast.success('Added to wishlist ❤️');
    }
    setWishlist(newWishlist);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const wishlistCount = Object.keys(wishlist).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Logo */}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-gradient"
            >
              ShopX
            </motion.h1>

            {/* Search */}
            <div className="flex-1 min-w-[200px] max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="pl-10 rounded-xl shadow-soft"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger className="w-[160px] rounded-xl shadow-soft">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.sort}
                onValueChange={(value: any) => setFilters({ ...filters, sort: value })}
              >
                <SelectTrigger className="w-[160px] rounded-xl shadow-soft">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="lg"
                className="rounded-xl shadow-soft relative"
              >
                <Heart className="w-5 h-5 mr-2" />
                Wishlist
                {wishlistCount > 0 && (
                  <Badge className="ml-2 px-2 py-1 rounded-full bg-primary">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              <CartDrawer
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                open={cartOpen}
                onOpenChange={setCartOpen}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Filters filters={filters} onFiltersChange={(f) => setFilters({ ...filters, ...f })} />
          </aside>

          {/* Products Grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {filters.query || filters.category ? 'Search Results' : 'All Products'}
              </h2>
              <p className="text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-xl text-muted-foreground mb-4">No products match your filters</p>
                <Button
                  onClick={() =>
                    setFilters({
                      query: '',
                      category: '',
                      minPrice: null,
                      maxPrice: null,
                      inStockOnly: false,
                      sort: 'default',
                    })
                  }
                  variant="outline"
                  className="rounded-xl"
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={!!wishlist[product.id]}
                      onToggleWishlist={() => handleToggleWishlist(product.id)}
                      onAddToCart={() => handleAddToCart(product)}
                      onViewDetails={() => handleViewProduct(product)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        isWishlisted={selectedProduct ? !!wishlist[selectedProduct.id] : false}
        onToggleWishlist={() => selectedProduct && handleToggleWishlist(selectedProduct.id)}
        onAddToCart={() => selectedProduct && handleAddToCart(selectedProduct)}
      />
    </div>
  );
}
