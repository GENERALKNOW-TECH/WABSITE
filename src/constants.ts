import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Modern Chrome Kitchen Faucet',
    description: 'Elegant pull-down kitchen faucet with dual spray modes and ceramic disc valve.',
    price: 45000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 124,
    features: ['Pull-down sprayer', '360-degree swivel', 'Lead-free brass', 'Easy installation'],
    reviewList: [
      { id: 'r1', userName: 'Ahmed Khan', rating: 5, comment: 'Excellent quality and very easy to install. Highly recommended!', date: '2026-03-15' },
      { id: 'r2', userName: 'Sara Ali', rating: 4, comment: 'Great product, but the finish is slightly different from the pictures.', date: '2026-03-20' }
    ]
  },
  {
    id: '2',
    name: 'Luxury Rainfall Shower System',
    description: 'Complete shower system with 12-inch rainfall head and handheld sprayer.',
    price: 85000,
    category: 'Showers',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 89,
    features: ['Thermostatic control', 'Anti-scald protection', 'Matte black finish', 'Adjustable height'],
    reviewList: [
      { id: 'r3', userName: 'Bilal Sheikh', rating: 5, comment: 'The rainfall effect is amazing. Feels like a spa at home.', date: '2026-03-25' }
    ]
  },
  {
    id: '3',
    name: 'Minimalist Ceramic Vessel Sink',
    description: 'Sleek white ceramic vessel sink for a modern bathroom aesthetic.',
    price: 28000,
    category: 'Sanitary',
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 56,
    features: ['Scratch-resistant', 'Easy to clean', 'Above-counter mounting', 'Non-porous surface']
  },
  {
    id: '4',
    name: 'Smart Dual-Flush Toilet',
    description: 'High-efficiency dual-flush toilet with soft-close seat and powerful rimless flush.',
    price: 125000,
    category: 'Toilets',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviews: 42,
    features: ['Water-saving', 'Comfort height', 'Rimless design', 'Quick-release seat']
  },
  {
    id: '5',
    name: 'Stainless Steel Double Bowl Sink',
    description: 'Durable 16-gauge stainless steel kitchen sink with sound-dampening technology.',
    price: 65000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 210,
    features: ['Under-mount design', 'Commercial grade', 'Deep basins', 'Includes drain assembly']
  },
  {
    id: '6',
    name: 'Gold Finish Basin Mixer',
    description: 'Brushed gold bathroom faucet with a timeless curved design.',
    price: 35000,
    category: 'Faucets',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    reviews: 78,
    features: ['Single handle', 'Eco-flow aerator', 'Solid brass construction', 'Corrosion resistant']
  },
  {
    id: '7',
    name: 'Hashaam Traders No.004 Kitchen Faucet',
    description: 'Premium chrome-finished pull-down kitchen faucet with ergonomic handle.',
    price: 48000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 32,
    features: ['Chrome finish', 'Pull-down spray', 'High-arc design', 'Durable valve']
  },
  {
    id: '8',
    name: 'Hashaam Traders No.019 Kitchen Faucet',
    description: 'Sleek modern kitchen faucet with a minimalist curved spout.',
    price: 52000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 15,
    features: ['Minimalist design', 'Easy clean nozzle', 'Single lever control', 'Premium chrome']
  },
  {
    id: '9',
    name: 'Hashaam Traders No.007 Kitchen Faucet',
    description: 'Elegant high-arc kitchen faucet designed for superior performance.',
    price: 46000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da97753c?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 24,
    features: ['High-arc spout', '360-degree rotation', 'Ceramic disc cartridge', 'Lead-free']
  },
  {
    id: '10',
    name: 'Hashaam Traders No.016 Kitchen Faucet',
    description: 'Professional grade kitchen faucet with a robust chrome finish.',
    price: 55000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 18,
    features: ['Commercial grade', 'Heavy duty', 'Smooth operation', 'Rust resistant']
  },
  {
    id: '11',
    name: 'Hashaam Traders No.015 Kitchen Faucet',
    description: 'Contemporary kitchen faucet with integrated model identification.',
    price: 49000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1613546007220-8d863bc957e1?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 21,
    features: ['Modern aesthetic', 'Precision handle', 'Quick connect', 'Water saving']
  },
  {
    id: '12',
    name: 'Hashaam Traders No.009 Kitchen Faucet',
    description: 'Classic curved kitchen faucet with a polished chrome exterior.',
    price: 44000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1520981757719-350ad5845757?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 12,
    features: ['Classic design', 'Polished finish', 'Reliable performance', 'Standard fit']
  },
  {
    id: '13',
    name: 'Hashaam Traders No.010 Kitchen Faucet',
    description: 'Sophisticated kitchen fixture with a focus on durability and style.',
    price: 51000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 19,
    features: ['Stylish spout', 'Solid construction', 'Easy maintenance', 'Elegant handle']
  },
  {
    id: '14',
    name: 'Hashaam Traders No.01 Kitchen Faucet',
    description: 'The signature kitchen faucet from the Hashaam Traders collection.',
    price: 58000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviews: 45,
    features: ['Signature series', 'Top-tier finish', 'Advanced aerator', 'Lifetime warranty']
  },
  {
    id: '15',
    name: 'Hashaam Traders No.012 Kitchen Faucet',
    description: 'Modern kitchen mixer with precise temperature and flow control.',
    price: 47000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviews: 14,
    features: ['Precise control', 'Modern mixer', 'Compact design', 'High quality']
  },
  {
    id: '16',
    name: 'Hashaam Traders No.018 Kitchen Faucet',
    description: 'Versatile kitchen faucet with a clean, polished look.',
    price: 53000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 27,
    features: ['Versatile style', 'Polished chrome', 'Smooth swivel', 'Easy install']
  },
  {
    id: '17',
    name: 'Hashaam Traders No.021 Kitchen Faucet',
    description: 'The latest addition to the Hashaam Traders kitchen collection.',
    price: 56000,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 11,
    features: ['Latest model', 'Premium materials', 'Innovative design', 'Superior flow']
  }
];

export const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Products', value: 'All' },
  { label: 'Kitchen', value: 'Kitchen' },
  { label: 'Sanitary', value: 'Sanitary' },
  { label: 'Faucets', value: 'Faucets' },
  { label: 'Showers', value: 'Showers' },
  { label: 'Toilets', value: 'Toilets' },
];
