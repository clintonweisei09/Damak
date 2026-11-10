export type ProductCategory = 
  | 'all' 
  | 'chickens'
  | 'rabbits'
  | 'guinea-fowls'
  | 'guinea-pigs'
  | 'fish'
  | 'turkeys'
  | 'ducks'
  | 'crop-produce'
  | 'rare-produce' 
  | 'poultry' 
  | 'small-animals' 
  | 'organic-crops' 
  | 'pantry-starts';

export interface GrowthStage {
  name: string;
  dayRange: string;
  completed: boolean;
  current: boolean;
}

export interface GrowthProgress {
  percentage: number;
  currentDay: number;
  totalDays: number;
  currentStage: string;
  stageNumber: number;
  daysUntilHarvest: number;
  statusText: 'Harvest Ready' | 'Rapid Maturation' | 'Vegetative Canopy' | 'Active Flowering' | 'Ready for Pick';
  stages: GrowthStage[];
}

export interface Product {
  id: string;
  name: string;
  scientificOrBreedName?: string;
  category: ProductCategory;
  price: number;
  unit: string;
  description: string;
  provenance: string;
  organic: boolean;
  rare: boolean;
  inStock: boolean;
  stockCount: number;
  image: string;
  batchCode: string;
  husbandryOrCareNotes?: string;
  seasonalAvailability: string;
  shippingMethod: 'pickup-or-delivery' | 'pickup-only' | 'express-courier';
  badgeNote?: string;
  flavorOrCharacteristics?: string[];
  growthProgress?: GrowthProgress;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdviceArticle {
  id: string;
  title: string;
  category: 'poultry' | 'small-mammals' | 'rare-crops' | 'soil-permaculture';
  categoryLabel: string;
  summary: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishDate: string;
  keyTakeaways: string[];
  content: string[];
  farmerTip: string;
  relatedProductId?: string;
}

export interface FaqQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  farmer: string;
}

export interface OrderConfirmation {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  fulfillmentType: 'pickup' | 'delivery';
  address?: string;
  pickupSlot?: string;
  deliveryDate?: string;
  notes?: string;
  paymentMethod: 'mpesa' | 'cod' | 'card';
  mpesaReceiptNumber?: string;
  mpesaPhone?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
}
