import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cake } from '@/types/cake';

export interface CartItem {
  cake: Cake;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (cake: Cake, quantity?: number) => void;
  removeItem: (cakeId: number) => void;
  updateQuantity: (cakeId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (cake, quantity = 1) => set((state) => {
        const existingIndex = state.items.findIndex(item => item.cake.id === cake.id);
        
        if (existingIndex > -1) {
          const updatedItems = [...state.items];
          // Limit max quantity to cake stock if available
          const currentQty = updatedItems[existingIndex].quantity;
          const newQty = Math.min(currentQty + quantity, cake.stock);
          updatedItems[existingIndex].quantity = newQty;
          return { items: updatedItems };
        }
        
        // Add new item, ensuring it doesn't exceed stock limit
        const initialQty = Math.min(quantity, cake.stock);
        if (initialQty === 0) return state; // out of stock
        return { items: [...state.items, { cake, quantity: initialQty }] };
      }),

      removeItem: (cakeId) => set((state) => ({
        items: state.items.filter(item => item.cake.id !== cakeId)
      })),

      updateQuantity: (cakeId, quantity) => set((state) => {
        const updatedItems = state.items.map(item => {
          if (item.cake.id === cakeId) {
            const validQty = Math.min(Math.max(1, quantity), item.cake.stock);
            return { ...item, quantity: validQty };
          }
          return item;
        });
        return { items: updatedItems };
      }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((acc, item) => acc + (item.cake.price * item.quantity), 0);
      },
    }),
    {
      name: 'cakehub-cart-storage',
    }
  )
);
