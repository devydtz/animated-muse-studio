import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../lib/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[rgba(10,10,26,0.98)] backdrop-blur-xl border-l border-[rgba(0,212,255,0.1)] z-50 flex flex-col">
        <div className="p-6 border-b border-[rgba(0,212,255,0.1)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#00d4ff]" />
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[rgba(0,212,255,0.1)] transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Your cart is empty</p>
              <Link
                to="/ranks"
                onClick={onClose}
                className="btn-primary inline-block"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.product.image_url || 'https://images.pexels.com/photos/167097/pexels-photo-167097.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-[#00d4ff] font-bold">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.1)] flex items-center justify-center hover:bg-[rgba(0,212,255,0.2)] transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#00d4ff]" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.1)] flex items-center justify-center hover:bg-[rgba(0,212,255,0.2)] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#00d4ff]" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[rgba(0,212,255,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-2xl font-display font-bold text-white">
                ${getTotal().toFixed(2)}
              </span>
            </div>
            <div className="space-y-3">
              <Link
                to="/checkout"
                onClick={onClose}
                className="btn-primary w-full text-center block"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={clearCart}
                className="btn-secondary w-full"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}