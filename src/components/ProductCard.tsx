import { ShoppingCart, Crown, Key, Package, Check, Star } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { useCartStore } from '../lib/store';

interface ProductCardProps {
  product: Product;
}

const categoryIcons = {
  rank: Crown,
  key: Key,
  bundle: Package,
};

const categoryColors = {
  rank: 'from-[#7c3aed] to-[#00d4ff]',
  key: 'from-[#f59e0b] to-[#ff6b35]',
  bundle: 'from-[#10b981] to-[#00d4ff]',
};

const categoryBadges = {
  rank: { bg: 'bg-gradient-to-r from-[rgba(124,58,237,0.3)] to-[rgba(0,212,255,0.3)]', border: 'border-[rgba(124,58,237,0.5)]' },
  key: { bg: 'bg-gradient-to-r from-[rgba(245,158,11,0.3)] to-[rgba(255,107,53,0.3)]', border: 'border-[rgba(245,158,11,0.5)]' },
  bundle: { bg: 'bg-gradient-to-r from-[rgba(16,185,129,0.3)] to-[rgba(0,212,255,0.3)]', border: 'border-[rgba(16,185,129,0.5)]' },
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore();
  const Icon = categoryIcons[product.category];
  const inCart = items.some((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    addItem(product);
  };

  const defaultImages = {
    rank: 'https://images.pexels.com/photos/167097/pexels-photo-167097.jpeg?auto=compress&cs=tinysrgb&w=400',
    key: 'https://images.pexels.com/photos/173524/pexels-photo-173524.jpeg?auto=compress&cs=tinysrgb&w=400',
    bundle: 'https://images.pexels.com/photos/391302/pexels-photo-391302.jpeg?auto=compress&cs=tinysrgb&w=400',
  };

  return (
    <div className="product-card glass-card rounded-2xl overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image_url || defaultImages[product.category]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,26,1)] via-transparent to-transparent" />
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${categoryBadges[product.category].bg} ${categoryBadges[product.category].border} border backdrop-blur-sm`}>
          <Icon className="w-3.5 h-3.5" />
          {product.category}
        </div>
        {product.category === 'bundle' && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#f59e0b] text-xs font-bold text-white flex items-center gap-1">
            <Star className="w-3 h-3" />
            BEST VALUE
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-[#00d4ff] transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {product.features && product.features.length > 0 && (
          <div className="mb-4 space-y-2">
            {(Array.isArray(product.features) ? product.features : []).slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
            {(Array.isArray(product.features) ? product.features : []).length > 4 && (
              <p className="text-xs text-gray-500">
                +{(Array.isArray(product.features) ? product.features : []).length - 4} more features
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className={`text-3xl font-display font-bold bg-gradient-to-r ${categoryColors[product.category]} bg-clip-text text-transparent`}>
              ${product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`glow-button flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
              inCart
                ? 'bg-[#10b981] text-white'
                : 'bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0a0a1a]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}