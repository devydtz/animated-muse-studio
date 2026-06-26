import { useEffect, useState } from 'react';
import { Key } from 'lucide-react';
import { supabase, type Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

export default function Keys() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').eq('category', 'key').eq('active', true).order('display_order', { ascending: true });
      if (data) setProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ff6b35] flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Crate Keys</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Purchase Mystery Crate Keys to unlock rare and exclusive items.</p>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (<div key={i} className="glass-card rounded-2xl h-96 animate-pulse" />))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12"><Key className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-400">No keys available</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}
      </div>
    </div>
  );
}