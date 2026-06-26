import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Settings, Sparkles } from 'lucide-react';
import { useCartStore } from '../lib/store';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/ranks', label: 'Ranks' },
    { path: '/keys', label: 'Keys' },
    { path: '/bundles', label: 'Bundles' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(10,10,26,0.95)] backdrop-blur-xl border-b border-[rgba(0,212,255,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-[#00d4ff] group-hover:text-[#7c3aed] transition-colors" />
              <div className="absolute inset-0 bg-[#00d4ff] blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="font-display text-2xl font-bold text-white glow-text">
              LUNARIS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#00d4ff]'
                    : 'text-gray-300 hover:text-[#00d4ff]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/checkout"
              className="relative p-2 rounded-lg hover:bg-[rgba(0,212,255,0.1)] transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-[#00d4ff]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#ff6b35] to-[#f59e0b] rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/admin"
              className="relative p-2 rounded-lg hover:bg-[rgba(0,212,255,0.1)] transition-all opacity-30 hover:opacity-100"
              title="Admin"
            >
              <Settings className="w-5 h-5 text-gray-500 hover:text-[#00d4ff] transition-colors" />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[rgba(0,212,255,0.1)]"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-[#00d4ff]" />
              ) : (
                <Menu className="w-6 h-6 text-[#00d4ff]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[rgba(10,10,26,0.98)] backdrop-blur-xl border-t border-[rgba(0,212,255,0.1)]">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-[rgba(0,212,255,0.1)] text-[#00d4ff]'
                    : 'text-gray-300 hover:bg-[rgba(0,212,255,0.05)] hover:text-[#00d4ff]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-[rgba(0,212,255,0.05)] hover:text-[#00d4ff]"
            >
              Cart ({itemCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}