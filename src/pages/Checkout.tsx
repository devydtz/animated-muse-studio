import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, User, Mail, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ minecraft_username: '', email: '', payment_method: 'paypal' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.minecraft_username.trim()) newErrors.minecraft_username = 'Minecraft username is required';
    else if (formData.minecraft_username.length < 3) newErrors.minecraft_username = 'Username must be at least 3 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || items.length === 0) return;
    setLoading(true);
    try {
      const total = getTotal();
      const { data: order, error: orderError } = await supabase.from('orders').insert({ minecraft_username: formData.minecraft_username, email: formData.email, total, status: 'pending', payment_method: formData.payment_method }).select().single();
      if (orderError) throw orderError;
      const orderItems = items.map((item) => ({ order_id: order.id, product_id: item.product.id, product_name: item.product.name, quantity: item.quantity, price_at_time: item.product.price }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
      setOrderId(order.id); setSuccess(true); clearCart();
    } catch (err) { console.error('Order error:', err); setErrors({ submit: 'Failed to place order. Please try again.' }); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#10b981] to-[#00d4ff] flex items-center justify-center"><Check className="w-8 h-8 text-white" /></div>
            <h1 className="font-display text-3xl font-bold text-white mb-4">Order Placed!</h1>
            <p className="text-gray-400 mb-6">Your order has been received and is pending payment confirmation. Our team will process your order shortly.</p>
            <div className="glass-card rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-2"><span className="text-gray-400">Order ID:</span><span className="text-white font-mono text-sm">{orderId}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-400">Username:</span><span className="text-white">{formData.minecraft_username}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Total:</span><span className="text-[#00d4ff] font-bold">${getTotal().toFixed(2)}</span></div>
            </div>
            <p className="text-sm text-gray-500 mb-6">Please send payment via PayPal to: <span className="text-[#00d4ff]">payments@lunaris.gg</span><br />Include your Order ID in the payment note.</p>
            <Link to="/" className="btn-primary inline-block">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-white mb-8 text-center">Checkout</h1>
        {items.length === 0 ? (
          <div className="text-center py-12"><ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-400 mb-4">Your cart is empty</p><Link to="/ranks" className="btn-primary inline-block">Browse Products</Link></div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-white mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">{items.map((item) => (<div key={item.product.id} className="flex justify-between"><div><p className="text-white font-medium">{item.product.name}</p><p className="text-gray-500 text-sm">Qty: {item.quantity}</p></div><p className="text-[#00d4ff] font-bold">${(item.product.price * item.quantity).toFixed(2)}</p></div>))}</div>
                <div className="border-t border-[rgba(0,212,255,0.1)] pt-4"><div className="flex justify-between text-lg"><span className="text-gray-400">Total</span><span className="text-[#00d4ff] font-display font-bold text-2xl">${getTotal().toFixed(2)}</span></div></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold text-white mb-6">Your Information</h2>
                {errors.submit && (<div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><span className="text-red-400">{errors.submit}</span></div>)}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div><label className="flex items-center gap-2 mb-2"><User className="w-4 h-4 text-[#00d4ff]" />Minecraft Username</label><input type="text" value={formData.minecraft_username} onChange={(e) => setFormData({ ...formData, minecraft_username: e.target.value })} placeholder="Your Minecraft username" className={errors.minecraft_username ? 'border-red-500' : ''} />{errors.minecraft_username && (<p className="text-red-400 text-sm mt-1">{errors.minecraft_username}</p>)}</div>
                  <div><label className="flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-[#00d4ff]" />Email Address</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className={errors.email ? 'border-red-500' : ''} />{errors.email && (<p className="text-red-400 text-sm mt-1">{errors.email}</p>)}</div>
                  <div><label className="flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4 text-[#00d4ff]" />Payment Method</label><select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}><option value="paypal">PayPal</option><option value="cashapp">Cash App</option><option value="venmo">Venmo</option></select></div>
                  <div className="pt-4"><button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full flex items-center justify-center gap-2">{loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing...</>) : (<>Place Order - ${getTotal().toFixed(2)}</>)}</button></div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}