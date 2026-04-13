import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, User, X, PlusCircle, Settings, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import AuthDialog from './AuthDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface NavbarProps {
  cartItems: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearch: (query: string) => void;
  companyName: string;
  onOpenProfile: () => void;
  onOpenAddProduct: () => void;
}

export default function Navbar({ 
  cartItems, 
  wishlistCount,
  onOpenCart, 
  onOpenWishlist,
  onSearch, 
  companyName, 
  onOpenProfile, 
  onOpenAddProduct 
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, signOut } = useAuth();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/" className="text-2xl font-heading font-bold tracking-tight flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <span className="relative bg-white text-primary px-3 py-1 rounded-lg border border-indigo-100 shadow-sm transition-transform group-hover:scale-105 block">
                {companyName.split(' ')[0]}
              </span>
            </div>
            <span className="text-gradient font-sans font-extrabold tracking-tighter">
              {companyName.split(' ').slice(1).join(' ')}
            </span>
          </a>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wide text-gray-500">
            <a href="#products" className="hover:text-primary transition-all hover:translate-y-[-1px]">Shop</a>
            <a href="#about" className="hover:text-primary transition-all hover:translate-y-[-1px]">About</a>
            <a href="#footer" className="hover:text-primary transition-all hover:translate-y-[-1px]">Contact</a>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex items-center relative group">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search elegance..."
              className="pl-10 w-40 md:w-60 bg-white/50 backdrop-blur-sm border-white/20 focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full transition-all focus-visible:w-72"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
            />
          </div>

          <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={onOpenAddProduct} title="Add Product">
            <PlusCircle className="w-5 h-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="hidden sm:flex" title="User Dashboard" />}>
              <User className="w-5 h-5" />
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-bold">{user.displayName}</span>
                    <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenProfile}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              className="hidden sm:flex rounded-full px-6 font-bold"
              onClick={() => setIsAuthDialogOpen(true)}
            >
              Sign In
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative" onClick={onOpenWishlist} title="Wishlist">
            <Heart className="w-5 h-5" />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-[10px]">
                    {wishlistCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <Button variant="ghost" size="icon" className="relative" onClick={onOpenCart}>
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-primary text-[10px]">
                    {cartCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-10">
                {user && (
                  <div className="flex items-center gap-3 pb-6 border-b">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.displayName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">{user.displayName}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </div>
                )}
                <a href="#products" className="text-lg font-semibold">Shop</a>
                <a href="#about" className="text-lg font-semibold">About</a>
                <a href="#footer" className="text-lg font-semibold">Contact</a>
                <button 
                  onClick={() => { onOpenWishlist(); }}
                  className="text-lg font-semibold flex items-center justify-between"
                >
                  Wishlist
                  {wishlistCount > 0 && (
                    <Badge className="bg-red-500 ml-2">{wishlistCount}</Badge>
                  )}
                </button>
                <div className="pt-6 border-t space-y-4">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="justify-start gap-2" onClick={() => { onOpenAddProduct(); }}>
                      <PlusCircle className="w-5 h-5" />
                      Add Product
                    </Button>
                    {user ? (
                      <>
                        <Button variant="outline" className="justify-start gap-2" onClick={() => { onOpenProfile(); }}>
                          <User className="w-5 h-5" />
                          Dashboard
                        </Button>
                        <Button variant="outline" className="justify-start gap-2 text-red-500" onClick={signOut}>
                          <LogOut className="w-5 h-5" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" onClick={() => setIsAuthDialogOpen(true)}>Sign In</Button>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search..." 
                      className="pl-9" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        onSearch(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <AuthDialog isOpen={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </nav>
  );
}
