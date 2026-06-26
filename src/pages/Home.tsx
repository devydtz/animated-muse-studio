import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Key, Package, Zap, Shield, Users, Star } from 'lucide-react';
import { supabase, type Product } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true })
        .limit(6);
      if (data) setFeaturedProducts(data as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const features = [
    { icon: Zap, title: 'Instant Delivery', description: 'Your purchases are delivered instantly to your Minecraft account' },
    { icon: Shield, title: 'Secure Payments', description: 'All transactions are securely processed and verified' },
    { icon: Users, title: '24/7 Support', description: 'Our team is always ready to help with any issues' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="hero-gradient absolute inset-0" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[rgba(124,58,237,0.3)] to-[rgba(0,212,255,0.3)] border border-[rgba(124,58,237,0.5)]">
            <Star className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-sm font-medium">Premium Minecraft Experience</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">Welcome to</span><br />
            <span className="bg-gradient-to-r from-[#00d4ff] via-[#7c3aed] to-[#ff6b35] bg-clip-text text-transparent glow-text">LUNARIS MC</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium ranks, exclusive crate keys, and amazing bundles. Level up your Minecraft experience today!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/ranks" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://discord.gg/yourserver" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              Join Discord
            </a>
          </div>
          <div className="mt-12 flex justify-center gap-12">
            <div className="text-center"><div className="text-3xl font-display font-bold text-[#00d4ff]">1000+</div><div className="text-sm text-gray-400">Active Players</div></div>
            <div className="text-center"><div className="text-3xl font-display font-bold text-[#10b981]">500+</div><div className="text-sm text-gray-400">Purchases</div></div>
            <div className="text-center"><div className="text-3xl font-display font-bold text-[#f59e0b]">99%</div><div className="text-sm text-gray-400">Satisfaction</div></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-white">Browse by</span> <span className="text-[#00d4ff]">Category</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/ranks" className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">Ranks</h3>
              <p className="text-gray-400 mb-4">Unlock special perks and abilities</p>
              <span className="text-[#00d4ff] font-medium flex items-center justify-center gap-2">View Ranks <ArrowRight className="w-4 h-4" /></span>
            </Link>
            <Link to="/keys" className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ff6b35] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">Crate Keys</h3>
              <p className="text-gray-400 mb-4">Win rare and exclusive items</p>
              <span className="text-[#f59e0b] font-medium flex items-center justify-center gap-2">View Keys <ArrowRight className="w-4 h-4" /></span>
            </Link>
            <Link to="/bundles" className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#10b981] to-[#00d4ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">Bundles</h3>
              <p className="text-gray-400 mb-4">Get more for less with bundles</p>
              <span className="text-[#10b981] font-medium flex items-center justify-center gap-2">View Bundles <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[rgba(0,0,0,0.2)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-white">Featured</span> <span className="text-[#00d4ff]">Products</span>
          </h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (<div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/ranks" className="btn-secondary inline-flex items-center gap-2">View All Products <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-white">Why Choose</span> <span className="text-[#00d4ff]">Lunaris?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-[rgba(0,212,255,0.1)]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-display text-2xl font-bold text-white mb-4">LUNARIS MC</div>
          <p className="text-gray-400 text-sm mb-4">Premium Minecraft Server Experience</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span>play.lunaris.gg</span><span>|</span>
            <a href="https://discord.gg/yourserver" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] hover:underline">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}