import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from './supabase';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'lunaris-cart',
    }
  )
);

interface AdminStore {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: async (username: string, password: string) => {
        try {
          const storedAuth = localStorage.getItem('lunaris-admin-auth');
          if (storedAuth) {
            const auth = JSON.parse(storedAuth);
            if (auth.username === username && auth.password === password) {
              set({ isLoggedIn: true });
              return true;
            }
          }
          if (username === 'admin' && password === 'lunaris2024') {
            localStorage.setItem('lunaris-admin-auth', JSON.stringify({ username, password }));
            set({ isLoggedIn: true });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      logout: () => {
        localStorage.removeItem('lunaris-admin-auth');
        set({ isLoggedIn: false });
      },
      checkSession: () => {
        const storedAuth = localStorage.getItem('lunaris-admin-auth');
        if (storedAuth) {
          set({ isLoggedIn: true });
        }
      },
    }),
    {
      name: 'lunaris-admin',
    }
  )
);