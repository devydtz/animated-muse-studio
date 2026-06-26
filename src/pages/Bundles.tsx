import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { supabase, type Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

export default function Bundles() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').eq('category', 'bundle').eq('active', true).order('display_order', { ascending: true });
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#00d4ff] flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Bundles</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Get the best value with our exclusive bundles.</p>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (<div key={i} className="glass-card rounded-2xl h-96 animate-pulse" />))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12"><Package className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-400">No bundles available</p></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}
      </div>
    </div>
  );
}