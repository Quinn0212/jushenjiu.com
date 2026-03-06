/**
 * 应用数据类型定义
 * NOTE: PRODUCTS 硬编码数据已迁移到 Supabase 数据库，此处仅保留类型定义
 */

export interface Product {
  id: string;
  name: string;
  english_name?: string;
  englishName?: string;
  price: number;
  original_price?: number;
  originalPrice?: number;
  image: string;
  category: string;
  tags: string[];
  description: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  englishName?: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  checked: boolean;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  time?: string;
  created_at?: string;
  type: 'order_success' | 'system';
  read: boolean;
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatar_url?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  signature?: string;
  member_level: string;
}

export interface Order {
  id: string;
  order_no: string;
  total: number;
  status: string;
  payment_method?: string;
  address?: Record<string, any>;
  remark?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Pick<Product, 'id' | 'name' | 'image' | 'english_name'>;
}

export interface Coupon {
  id: string;
  name: string;
  value: number;
  description: string;
  min_amount: number;
  expiry: string;
  status: string;
}

export type Screen = 'home' | 'category' | 'cart' | 'profile' | 'detail' | 'search' | 'notifications' | 'culture' | 'checkout' | 'coupons' | 'footprints' | 'favorites' | 'settings' | 'customer_service' | 'orders' | 'settings_profile' | 'settings_security' | 'settings_notifications' | 'login' | 'register';

/**
 * 规范化产品数据
 * NOTE: 用于将 Supabase snake_case 字段名映射为前端 camelCase
 */
export function normalizeProduct(p: any): Product {
  return {
    ...p,
    englishName: p.english_name || p.englishName,
    originalPrice: p.original_price || p.originalPrice,
  };
}
