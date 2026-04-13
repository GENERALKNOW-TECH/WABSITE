import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Pencil, Trash2, Heart, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isWishlisted?: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: () => void;
  onViewDetails: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({ 
  product, 
  isWishlisted,
  onAddToCart, 
  onToggleWishlist,
  onViewDetails, 
  onEdit, 
  onDelete 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setIsAdded(true);
    setQuantity(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="overflow-hidden border-none bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-500 group rounded-[2rem]">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/80 backdrop-blur-md text-gray-900 border-none font-bold text-[10px] tracking-wider px-3 py-1 rounded-full shadow-sm">
              {product.category}
            </Badge>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
            <Button 
              size="icon-xs" 
              variant="secondary" 
              className={`glass transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist();
              }}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
            <Button 
              size="icon-xs" 
              variant="secondary" 
              className="glass text-indigo-600 hover:bg-indigo-50"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button 
              size="icon-xs" 
              variant="secondary" 
              className="glass text-red-600 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product.id);
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 glass shadow-xl scale-90 group-hover:scale-100 transition-transform" onClick={() => onViewDetails(product.id)}>
              <Eye className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{product.rating} ({product.reviews})</span>
          </div>
          <h3 className="font-heading text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-gray-400 font-light line-clamp-2 h-10 mb-4 leading-relaxed">{product.description}</p>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">Rs. {product.price.toLocaleString()}</div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full bg-gray-50 rounded-xl p-1 border border-gray-100">
            <Button 
              variant="ghost" 
              size="icon-xs" 
              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all"
              onClick={handleDecrement}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-sm font-bold w-8 text-center">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon-xs" 
              className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all"
              onClick={handleIncrement}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <Button 
            className={`w-full h-12 rounded-xl font-bold transition-all hover:translate-y-[-2px] active:translate-y-[0px] shadow-lg shadow-gray-200 ${
              isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-black'
            }`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}
