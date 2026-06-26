import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'rank' | 'key' | 'bundle';
  image_url: string | null;
  minecraft_command: string;
  features: string[];
  active: boolean;
  display_order: number;
  created_at: string;
};

export type Order = {
  id: string;
  minecraft_username: string;
  email: string;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  payment_method: string;
  payment_proof: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};