export type Category = 'Sanitary' | 'Kitchen' | 'Faucets' | 'Showers' | 'Sinks' | 'Toilets';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
  reviewList?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
  };
}
