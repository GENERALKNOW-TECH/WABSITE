import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Droplets, Utensils, ShieldCheck, Truck, Clock, Star, CheckCircle2, Upload, ImageIcon, Facebook, Twitter, Instagram, Youtube, Music2, MapPin, Phone, Mail, Globe, Pencil, Trash2, Filter, SlidersHorizontal, X, Heart, ChevronLeft, ChevronRight, Search, Plus, Minus, ShoppingCart } from 'lucide-react';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSheet from './components/CartSheet';
import WishlistSheet from './components/WishlistSheet';
import CheckoutDialog from './components/CheckoutDialog';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, Category, Review, Order } from './types';

import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'GROW Sanitary & Kitchen Product',
    address: '123 Industrial Area, Phase 2, Karachi, Pakistan',
    phone: '+92 300 1234567',
    email: 'info@growsanitary.pk',
    website: 'www.growsanitary.pk',
    facebook: 'https://facebook.com/growsanitary',
    twitter: 'https://x.com/growsanitary',
    instagram: 'https://instagram.com/growsanitary',
    youtube: 'https://youtube.com/growsanitary',
    tiktok: 'https://tiktok.com/@growsanitary'
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'info' | 'orders'>('info');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<string>('0');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [featuredQuantity, setFeaturedQuantity] = useState(1);
  const [isFeaturedAdded, setIsFeaturedAdded] = useState(false);
  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  const [isDetailsAdded, setIsDetailsAdded] = useState(false);

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredProducts.length);
    setFeaturedQuantity(1);
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    setFeaturedQuantity(1);
  };
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId), 
    [products, selectedProductId]
  );

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'Sanitary',
    rating: 5,
    reviews: 0,
    features: []
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesPrice = true;
      if (priceRange === 'below-50k') matchesPrice = p.price < 50000;
      else if (priceRange === '50k-100k') matchesPrice = p.price >= 50000 && p.price <= 100000;
      else if (priceRange === 'above-100k') matchesPrice = p.price > 100000;

      const matchesRating = p.rating >= Number(minRating);

      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });
  }, [activeCategory, searchQuery, priceRange, minRating, products]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.info('Item removed from cart');
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        toast.info(`${product.name} removed from wishlist`);
        return prev.filter((p) => p.id !== product.id);
      }
      toast.success(`${product.name} added to wishlist!`);
      return [...prev, product];
    });
  };

  const handleCheckoutComplete = (shippingData: { fullName: string; address: string; city: string; zipCode: string }) => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [...cartItems],
      total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      status: 'Processing',
      shippingAddress: shippingData
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    toast.success('Thank you for your order!');
    setProfileTab('orders');
    setIsProfileOpen(true); // Show the order tracking immediately
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'Cancelled' as const } : order
      )
    );
    toast.info('Order has been cancelled');
  };

  // Simulate order status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.status === 'Processing') {
            return { ...order, status: 'Shipped' };
          }
          if (order.status === 'Shipped') {
            // Randomly deliver some orders
            if (Math.random() > 0.7) {
              return { ...order, status: 'Delivered' };
            }
          }
          return order;
        })
      );
    }, 15000); // Check every 15 seconds

    return () => clearInterval(timer);
  }, []);

  const addReview = (productId: string) => {
    if (!newReview.userName || !newReview.comment) {
      toast.error('Please fill in all fields');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [...(p.reviewList || []), review];
        const newTotalReviews = updatedReviews.length;
        const newAvgRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / newTotalReviews;
        
        return {
          ...p,
          reviewList: updatedReviews,
          reviews: newTotalReviews,
          rating: Number(newAvgRating.toFixed(1))
        };
      }
      return p;
    }));

    setNewReview({ userName: '', rating: 5, comment: '' });
    toast.success('Review submitted successfully!');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditProductOpen(true);
  };

  const updateProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setIsEditProductOpen(false);
      setEditingProduct(null);
      toast.success('Product updated successfully');
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar 
        cartItems={cartItems} 
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSearch={setSearchQuery}
        companyName={companyInfo.name}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-100/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 px-5 py-1.5 text-sm font-semibold tracking-wide border-none">
                ✨ Premium Collection 2026
              </Badge>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-heading font-bold text-gray-900 leading-[1.1] mb-8">
                Refine Your <br />
                <span className="text-gradient">Living Essence</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl">
                Experience the intersection of luxury and utility. Our curated fixtures bring a touch of 
                sophistication to every corner of your sanctuary.
              </p>
              <div className="flex flex-wrap gap-5">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90 text-lg px-10 h-16 font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                  onClick={() => {
                    setActiveCategory('Kitchen');
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Kitchen Shop
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-gray-50 text-lg px-10 h-16 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95"
                  onClick={() => {
                    setActiveCategory('Sanitary');
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Bathroom Shop
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white/50 glass">
                <img 
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200" 
                  alt="Luxury Fixture" 
                  className="w-full h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl shadow-2xl z-20 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4.9/5</div>
                    <div className="text-sm text-gray-500">Customer Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-32 bg-white/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 mb-6 px-5 py-1.5 border-none font-bold tracking-wider uppercase text-[10px]">
                Curated Selection
              </Badge>
              <h2 className="text-5xl font-heading font-bold text-gray-900 leading-tight">Masterpieces of Design</h2>
              <p className="text-gray-500 mt-4 text-xl font-light">Handpicked fixtures that define modern luxury and timeless elegance.</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-16 w-16 border-gray-100 bg-white shadow-sm hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-95"
                onClick={prevFeatured}
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-16 w-16 border-gray-100 bg-white shadow-sm hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-95"
                onClick={nextFeatured}
              >
                <ChevronRight className="w-7 h-7" />
              </Button>
            </div>
          </div>

          <div className="relative min-h-[650px] md:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeaturedIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
                <div className="relative h-[400px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group">
                  <img 
                    src={featuredProducts[currentFeaturedIndex].image} 
                    alt={featuredProducts[currentFeaturedIndex].name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-8 left-8">
                    <div className="glass px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600">
                      Featured
                    </div>
                  </div>
                </div>
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(featuredProducts[currentFeaturedIndex].rating) ? 'fill-indigo-500 text-indigo-500' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase">
                        {featuredProducts[currentFeaturedIndex].reviews} Verified Reviews
                      </span>
                    </div>
                    <h3 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 leading-[1.1]">
                      {featuredProducts[currentFeaturedIndex].name}
                    </h3>
                    <p className="text-xl text-gray-500 font-light leading-relaxed">
                      {featuredProducts[currentFeaturedIndex].description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-5xl font-bold text-gray-900 tracking-tight">
                      Rs. {featuredProducts[currentFeaturedIndex].price.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-indigo-600 border-indigo-100 bg-indigo-50/50 px-3 py-1 rounded-lg font-bold">
                      -20% Exclusive
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-5 pt-6 items-center">
                    <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100 h-16">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-14 w-14 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                        onClick={() => setFeaturedQuantity(prev => Math.max(1, prev - 1))}
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                      <span className="text-xl font-bold w-12 text-center">{featuredQuantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-14 w-14 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                        onClick={() => setFeaturedQuantity(prev => prev + 1)}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    <Button 
                      size="lg" 
                      className={`px-12 h-16 text-lg font-bold rounded-2xl shadow-xl transition-all hover:translate-y-[-4px] active:translate-y-[0px] ${
                        isFeaturedAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 text-white hover:bg-black'
                      }`}
                      onClick={() => {
                        addToCart(featuredProducts[currentFeaturedIndex], featuredQuantity);
                        setFeaturedQuantity(1);
                        setIsFeaturedAdded(true);
                        setTimeout(() => setIsFeaturedAdded(false), 2000);
                      }}
                      disabled={isFeaturedAdded}
                    >
                      <AnimatePresence mode="wait">
                        {isFeaturedAdded ? (
                          <motion.div
                            key="added"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center"
                          >
                            <CheckCircle2 className="w-5 h-5 mr-3" />
                            Added!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="add"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center"
                          >
                            <ShoppingCart className="w-5 h-5 mr-3" />
                            Add to Cart
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="px-12 h-16 text-lg font-bold rounded-2xl border-gray-200 hover:bg-gray-50 transition-all"
                      onClick={() => setSelectedProductId(featuredProducts[currentFeaturedIndex].id)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-4 mt-24">
            {featuredProducts.map((_, i) => (
              <button
                key={i}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === currentFeaturedIndex ? 'w-16 bg-indigo-600' : 'w-4 bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => setCurrentFeaturedIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-16 border-y border-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Truck, title: "Global Shipping", desc: "Premium delivery worldwide" },
              { icon: ShieldCheck, title: "Lifetime Warranty", desc: "Uncompromising quality" },
              { icon: Clock, title: "Concierge Support", desc: "24/7 dedicated assistance" },
              { icon: ArrowRight, title: "Seamless Returns", desc: "30-day effortless policy" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 group-hover:rotate-6">
                  {feature.title === "Global Shipping" ? (
                    <motion.div
                      animate={{ x: [0, 2, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <feature.icon className="w-7 h-7" />
                    </motion.div>
                  ) : (
                    <feature.icon className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 tracking-tight">{feature.title}</h4>
                  <p className="text-sm text-gray-400 font-light">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="products" className="container mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl font-heading font-bold text-gray-900 leading-tight">Our Collection</h2>
            <p className="text-gray-500 mt-4 text-xl font-light">Explore our range of premium fixtures, where every piece is a testament to quality.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
              <TabsList className="bg-gray-100/50 p-1 rounded-2xl h-14 border border-gray-100">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger 
                    key={cat.value} 
                    value={cat.value}
                    className="rounded-xl px-8 h-full font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Sheet>
              <SheetTrigger 
                render={
                  <Button variant="outline" className="h-14 px-6 rounded-2xl border-gray-100 bg-white hover:bg-gray-50 flex gap-2 font-bold">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                    {(priceRange !== 'all' || minRating !== '0') && (
                      <Badge variant="secondary" className="ml-1 bg-primary text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {[priceRange !== 'all', minRating !== '0'].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[400px] sm:w-[540px] p-10">
                <SheetHeader className="mb-10">
                  <SheetTitle className="text-3xl font-heading font-bold">Refine Selection</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Price Range</h4>
                    <RadioGroup value={priceRange} onValueChange={setPriceRange} className="gap-4">
                      <div className="flex items-center space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
                        <RadioGroupItem value="all" id="p-all" />
                        <Label htmlFor="p-all" className="font-bold flex-1 cursor-pointer">All Prices</Label>
                      </div>
                      <div className="flex items-center space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
                        <RadioGroupItem value="below-50k" id="p-1" />
                        <Label htmlFor="p-1" className="font-bold flex-1 cursor-pointer">Below Rs. 50,000</Label>
                      </div>
                      <div className="flex items-center space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
                        <RadioGroupItem value="50k-100k" id="p-2" />
                        <Label htmlFor="p-2" className="font-bold flex-1 cursor-pointer">Rs. 50,000 - Rs. 100,000</Label>
                      </div>
                      <div className="flex items-center space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
                        <RadioGroupItem value="above-100k" id="p-3" />
                        <Label htmlFor="p-3" className="font-bold flex-1 cursor-pointer">Above Rs. 100,000</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator className="bg-gray-50" />

                  <div className="space-y-6">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Minimum Rating</h4>
                    <Select value={minRating} onValueChange={setMinRating}>
                      <SelectTrigger className="w-full h-14 rounded-2xl border-gray-100">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-gray-100">
                        <SelectItem value="0" className="rounded-xl">All Ratings</SelectItem>
                        <SelectItem value="4" className="rounded-xl">4 Stars & Above</SelectItem>
                        <SelectItem value="3" className="rounded-xl">3 Stars & Above</SelectItem>
                        <SelectItem value="2" className="rounded-xl">2 Stars & Above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-10">
                    <Button 
                      variant="outline" 
                      className="w-full h-16 rounded-2xl font-bold border-gray-100 hover:bg-gray-50" 
                      onClick={() => {
                        setPriceRange('all');
                        setMinRating('0');
                        setActiveCategory('All');
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isWishlisted={wishlist.some(p => p.id === product.id)}
                onAddToCart={(p, q) => addToCart(p, q)}
                onToggleWishlist={() => toggleWishlist(product)}
                onViewDetails={(id) => setSelectedProductId(id)}
                onEdit={handleEditProduct}
                onDelete={deleteProduct}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">No treasures found</h3>
            <p className="text-gray-500 text-lg font-light mb-10">We couldn't find any products matching your current filters. Try a different search or category.</p>
            <Button 
              className="bg-gray-900 text-white hover:bg-black px-10 h-14 rounded-2xl font-bold" 
              onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </main>

      {/* Category Showcase */}
      <section className="bg-gray-50 py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200" 
                alt="Kitchen" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-white mb-6">
                  <Utensils className="w-8 h-8" />
                </div>
                <h3 className="text-5xl font-heading font-bold text-white mb-4">Gourmet Kitchen</h3>
                <p className="text-white/70 text-xl font-light mb-8 max-w-sm">Professional grade faucets and sinks for the heart of your home.</p>
                <Button className="w-fit bg-white text-gray-900 hover:bg-gray-100 px-10 h-14 rounded-2xl font-bold shadow-xl">Explore Kitchen</Button>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=1200" 
                alt="Bathroom" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-white mb-6">
                  <Droplets className="w-8 h-8" />
                </div>
                <h3 className="text-5xl font-heading font-bold text-white mb-4">Serene Sanctuary</h3>
                <p className="text-white/70 text-xl font-light mb-8 max-w-sm">Transform your bathroom into a spa-like retreat with our luxury fixtures.</p>
                <Button className="w-fit bg-white text-gray-900 hover:bg-gray-100 px-10 h-14 rounded-2xl font-bold shadow-xl">Explore Bathroom</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-5 py-1.5 border-none font-bold tracking-wider uppercase text-[10px]">
                  Our Legacy
                </Badge>
                <h2 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 leading-[1.1]">
                  Crafting Elegance <br />
                  <span className="text-gradient">Since 2010</span>
                </h2>
                <p className="text-xl text-gray-500 font-light leading-relaxed">
                  At {companyInfo.name}, we believe that your home deserves the finest fixtures. 
                  With over a decade of experience, we provide premium sanitary and kitchen solutions 
                  that combine innovative technology with timeless design.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: MapPin, title: "Flagship Showroom", desc: companyInfo.address },
                  { icon: Phone, title: "Direct Line", desc: companyInfo.phone },
                  { icon: Mail, title: "Inquiries", desc: companyInfo.email },
                  { icon: Globe, title: "Digital Presence", desc: companyInfo.website }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 flex-shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 font-light leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-gray-100">
                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">Connect With Us</h4>
                <div className="flex gap-4">
                  {[
                    { icon: Facebook, link: companyInfo.facebook },
                    { icon: Twitter, link: companyInfo.twitter },
                    { icon: Instagram, link: companyInfo.instagram },
                    { icon: Youtube, link: companyInfo.youtube },
                    { icon: Music2, link: companyInfo.tiktok }
                  ].map((social, i) => (
                    <a key={i} href={social.link} target="_blank" rel="noreferrer" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all hover:rotate-12">
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[16px] border-gray-50">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Showroom" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 glass p-10 rounded-[3rem] shadow-2xl max-w-xs hidden md:block animate-bounce-slow">
                <h4 className="text-4xl font-bold text-gray-900 mb-2">15+</h4>
                <p className="text-sm text-gray-500 font-light">Years of excellence in providing luxury home fixtures across Pakistan.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-gray-900 text-white pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <a href="/" className="text-3xl font-heading font-bold tracking-tighter flex items-center gap-1 group">
                <span className="bg-primary text-white px-3 py-1 rounded-xl shadow-lg transition-transform group-hover:scale-110">
                  {companyInfo.name.split(' ')[0]}
                </span>
                <span className="text-white px-1 transition-transform group-hover:translate-x-1">
                  {companyInfo.name.split(' ').slice(1).join(' ')}
                </span>
              </a>
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                Redefining modern living with curated fixtures that blend artistry with functionality. Excellence in every detail since 2010.
              </p>
              <div className="flex gap-4 pt-4">
                {[
                  { icon: Facebook, link: companyInfo.facebook },
                  { icon: Twitter, link: companyInfo.twitter },
                  { icon: Instagram, link: companyInfo.instagram },
                  { icon: Youtube, link: companyInfo.youtube },
                  { icon: Music2, link: companyInfo.tiktok }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-8">Collections</h4>
              <ul className="space-y-5 text-gray-400 font-light">
                <li><a href="#" className="hover:text-white transition-colors">Kitchen Faucets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bathroom Sinks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shower Systems</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smart Toilets</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-8">Company</h4>
              <ul className="space-y-5 text-gray-400 font-light">
                <li><a href="#about" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Showrooms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-8">Newsletter</h4>
              <p className="text-gray-400 font-light mb-6">Subscribe to receive exclusive offers and design inspiration.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl px-6">
                  Join
                </Button>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-500 font-light text-sm">
              © 2026 {companyInfo.name}. All rights reserved. Designed with passion.
            </p>
            <div className="flex gap-8 text-gray-500 font-light text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sheets and Dialogs */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <CartSheet 
          items={cartItems} 
          onUpdateQuantity={updateQuantity} 
          onRemove={removeFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      </Sheet>

      <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
        <WishlistSheet 
          items={wishlist}
          onRemove={(id) => setWishlist(prev => prev.filter(p => p.id !== id))}
          onAddToCart={(product) => {
            addToCart(product);
            setIsWishlistOpen(false);
          }}
        />
      </Sheet>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <CheckoutDialog 
          onComplete={handleCheckoutComplete} 
          items={cartItems}
          total={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
        />
      </Dialog>

      <Dialog open={!!selectedProductId} onOpenChange={(open) => !open && setSelectedProductId(null)}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square sticky top-0">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 flex flex-col">
                  <Badge className="w-fit mb-4">{selectedProduct.category}</Badge>
                  <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{selectedProduct.reviews} reviews</span>
                  </div>
                  <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Key Features</h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {selectedProduct.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t mb-8">
                  </div>

                  {/* Reviews Section */}
                  <div className="space-y-6 pt-8 border-t">
                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                    
                    {/* Review Form */}
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                      <h4 className="font-semibold text-sm">Leave a Review</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Your Name</Label>
                          <Input 
                            placeholder="John Doe" 
                            value={newReview.userName}
                            onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Rating</Label>
                          <select 
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                          >
                            {[5, 4, 3, 2, 1].map(num => (
                              <option key={num} value={num}>{num} Stars</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Comment</Label>
                        <Textarea 
                          placeholder="Share your experience..." 
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        />
                      </div>
                      <Button className="w-full" onClick={() => addReview(selectedProduct.id)}>Submit Review</Button>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                      {selectedProduct.reviewList && selectedProduct.reviewList.length > 0 ? (
                        selectedProduct.reviewList.map((review) => (
                          <div key={review.id} className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-sm">{review.userName}</p>
                                <div className="flex gap-0.5 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-6 border-t bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <DialogClose render={<Button variant="outline" className="px-8 h-12 rounded-xl font-bold border-gray-200 hover:bg-white transition-all">Back</Button>} />
                <span className="text-2xl font-bold text-primary hidden sm:block">Rs. {selectedProduct.price.toLocaleString()}</span>
              </div>
              <Button 
                className={`px-8 h-12 rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${
                  isDetailsAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                }`}
                onClick={() => {
                  if (selectedProduct) {
                    addToCart(selectedProduct);
                    setIsDetailsAdded(true);
                    setTimeout(() => {
                      setIsDetailsAdded(false);
                      setSelectedProductId(null);
                    }, 1000);
                  }
                }}
                disabled={isDetailsAdded}
              >
                <AnimatePresence mode="wait">
                  {isDetailsAdded ? (
                    <motion.div
                      key="added"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Added!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Dashboard</DialogTitle>
            <DialogDescription>Manage your profile and track your orders.</DialogDescription>
          </DialogHeader>
          
          <Tabs value={profileTab} onValueChange={(v) => setProfileTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="info">Company Profile</TabsTrigger>
              <TabsTrigger value="orders">Order Tracking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input 
                    value={companyInfo.name} 
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input 
                    value={companyInfo.phone} 
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    value={companyInfo.email} 
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea 
                    value={companyInfo.address} 
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  />
                </div>
                <Separator />
                <h4 className="font-bold text-sm">Social Media Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Facebook</Label>
                    <Input value={companyInfo.facebook} onChange={(e) => setCompanyInfo({...companyInfo, facebook: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">X (Twitter)</Label>
                    <Input value={companyInfo.twitter} onChange={(e) => setCompanyInfo({...companyInfo, twitter: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Instagram</Label>
                    <Input value={companyInfo.instagram} onChange={(e) => setCompanyInfo({...companyInfo, instagram: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">YouTube</Label>
                    <Input value={companyInfo.youtube} onChange={(e) => setCompanyInfo({...companyInfo, youtube: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">TikTok</Label>
                    <Input value={companyInfo.tiktok} onChange={(e) => setCompanyInfo({...companyInfo, tiktok: e.target.value})} />
                  </div>
                </div>
              </div>
              <Button className="w-full h-12 rounded-xl font-bold" onClick={() => {
                setIsProfileOpen(false);
                toast.success('Profile updated successfully!');
              }}>Save Changes</Button>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 text-sm">Your order history will appear here once you make a purchase.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-2xl overflow-hidden bg-white shadow-sm">
                      <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                          <p className="text-sm font-bold text-gray-900">{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                          <p className="text-sm font-bold text-gray-900">{order.date}</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-500' : 
                              order.status === 'Shipped' ? 'bg-blue-500' : 
                              order.status === 'Cancelled' ? 'bg-red-500' : 'bg-amber-500'
                            }`} />
                            <span className="text-sm font-bold text-gray-700">{order.status}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-primary">Rs. {order.total.toLocaleString()}</span>
                            {order.status === 'Processing' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs font-bold"
                                onClick={() => cancelOrder(order.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Items</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <img src={item.image} alt={item.name} className="w-6 h-6 object-cover rounded" referrerPolicy="no-referrer" />
                                <span className="text-xs font-medium text-gray-700">{item.quantity}x {item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Shipping To</p>
                          <p className="text-xs text-gray-600">{order.shippingAddress.fullName}</p>
                          <p className="text-xs text-gray-500">{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter product details to add it to the catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input 
                placeholder="e.g. Luxury Gold Faucet"
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (PKR)</Label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value as Category})}
                >
                  {CATEGORIES.filter(c => c.value !== 'All').map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex flex-col gap-4">
                {newProduct.image ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border bg-gray-50">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon-xs" 
                      className="absolute top-2 right-2"
                      onClick={() => setNewProduct({ ...newProduct, image: '' })}
                    >
                      <ImageIcon className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('product-image-upload')?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input 
                  id="product-image-upload"
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                <div className="flex items-center gap-2">
                  <Separator className="flex-1" />
                  <span className="text-[10px] text-gray-400 uppercase font-bold">or</span>
                  <Separator className="flex-1" />
                </div>
                <Input 
                  placeholder="Paste image URL instead..."
                  value={newProduct.image || ''}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe the product..."
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>
          </div>
          <Button className="w-full" onClick={() => {
            if (newProduct.name && newProduct.price && newProduct.image) {
              const product: Product = {
                ...newProduct as Product,
                id: Date.now().toString(),
                features: ['Premium Quality', 'Durable Design']
              };
              setProducts([product, ...products]);
              setIsAddProductOpen(false);
              toast.success('Product added successfully!');
            } else {
              toast.error('Please fill in all required fields');
            }
          }}>Add Product</Button>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details for this product.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (PKR)</Label>
                  <Input 
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value as Category})}
                  >
                    {CATEGORIES.filter(c => c.value !== 'All').map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <Button className="w-full" onClick={updateProduct}>Save Changes</Button>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right" />
    </div>
  );
}
