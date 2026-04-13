import { Trash2, ShoppingCart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistSheetProps {
  items: Product[];
  onRemove: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistSheet({ items, onRemove, onAddToCart }: WishlistSheetProps) {
  return (
    <SheetContent className="w-full sm:max-w-md flex flex-col">
      <SheetHeader className="pb-4">
        <SheetTitle className="text-2xl font-heading font-bold">Your Wishlist</SheetTitle>
        <SheetDescription>
          Save your favorite items for later.
        </SheetDescription>
      </SheetHeader>
      
      <Separator />
      
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="py-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary/40 mb-4">
                  <HeartOff className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Your wishlist is empty</h3>
                <p className="text-gray-500 max-w-[200px] mx-auto mt-2">
                  Browse our collection and save items you love!
                </p>
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.category}</p>
                      <p className="font-bold text-primary mt-1">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 h-8 text-xs gap-1"
                        onClick={() => onAddToCart(item)}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Add to Cart
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </SheetContent>
  );
}
