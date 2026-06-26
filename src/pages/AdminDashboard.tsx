import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, ShoppingCart, DollarSign, Check, X, Eye, Send, AlertCircle, Loader2, RefreshCw, Crown, Key } from 'lucide-react';
import { supabase, type Order, type Product, type OrderItem } from '../lib/supabase';
import { useAdminStore } from '../lib/store';

type OrderWithItems = Order & { order_items: OrderItem[] };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAdminStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'stats'>('orders');
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<OrderWithItems | null>(null);

  useEffect(() => { if (!isLoggedIn) navigate('/admin'); }, [isLoggedIn, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      const { data: productsData } = await supabase.from('products').select('*').order('category', { ascending: true }).order('display_order', { ascending: true });
      if (ordersData) setOrders(ordersData as OrderWithItems[]);
      if (productsData) setProducts(productsData as Product[]);
    } catch (err) { console.error('Error fetching data:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setProcessing(orderId);
    try {
      await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
      await fetchData(); setShowConfirmModal(false); setOrderToConfirm(null);
    } catch (err) { console.error('Error updating order:', err); }
    finally { setProcessing(null); }
  };

  const confirmPaymentAndDeliver = async (order: OrderWithItems) => {
    setProcessing(order.id);
    try {
      await supabase.from('orders').update({ status: 'processing', updated_at: new Date().toISOString() }).eq('id', order.id);
      console.log('Delivering items to Minecraft server for user:', order.minecraft_username);
      console.log('Items to deliver:', order.order_items);
      await supabase.from('orders').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', order.id);
      await fetchData(); setShowConfirmModal(false); setOrderToConfirm(null);
    } catch (err) { console.error('Error delivering items:', err); }
    finally { setProcessing(null); }
  };

  const toggleProductActive = async (productId: string, active: boolean) => {
    try { await supabase.from('products').update({ active: !active }).eq('id', productId); await fetchData(); }
    catch (err) { console.error('Error updating product:', err); }
  };

  const stats = { totalOrders: orders.length, pendingOrders: orders.filter((o) => o.status === 'pending').length, completedOrders: orders.filter((o) => o.status === 'completed').length, totalRevenue: orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.total, 0) };
  const statusColors: Record<string, string> = { pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', paid: 'bg-blue-500/20 text-blue-400 border-blue-500/30', processing: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', completed: 'bg-green-500/20 text-green-400 border-green-500/30', cancelled: 'bg-red-500/20 text-red-400 border-red-500/30' };

  return (
    <div className="min-h-screen pt-4 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div><h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1><p className="text-gray-400">Manage orders, products, and deliveries</p></div>
          <div className="flex items-center gap-4"><button onClick={fetchData} className="btn-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4" />Refresh</button><button onClick={handleLogout} className="btn-danger flex items-center gap-2"><LogOut className="w-4 h-4" />Logout</button></div>
        </div>
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0a0a1a]' : 'bg-[rgba(15,15,35,0.5)] text-gray-400 hover:text-white'}`}><ShoppingCart className="w-4 h-4" />Orders</button>
          <button onClick={() => setActiveTab('products')} className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0a0a1a]' : 'bg-[rgba(15,15,35,0.5)] text-gray-400 hover:text-white'}`}><Package className="w-4 h-4" />Products</button>
          <button onClick={() => setActiveTab('stats')} className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'stats' ? 'bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0a0a1a]' : 'bg-[rgba(15,15,35,0.5)] text-gray-400 hover:text-white'}`}><DollarSign className="w-4 h-4" />Statistics</button>
        </div>
        {loading ? (<div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" /></div>) : activeTab === 'stats' ? (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] flex items-center justify-center"><ShoppingCart className="w-6 h-6 text-white" /></div><div><p className="text-gray-400 text-sm">Total Orders</p><p className="text-3xl font-display font-bold text-white">{stats.totalOrders}</p></div></div></div>
            <div className="glass-card rounded-2xl p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ff6b35] flex items-center justify-center"><AlertCircle className="w-6 h-6 text-white" /></div><div><p className="text-gray-400 text-sm">Pending Orders</p><p className="text-3xl font-display font-bold text-white">{stats.pendingOrders}</p></div></div></div>
            <div className="glass-card rounded-2xl p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#10b981] to-[#00d4ff] flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div><div><p className="text-gray-400 text-sm">Completed Orders</p><p className="text-3xl font-display font-bold text-white">{stats.completedOrders}</p></div></div></div>
            <div className="glass-card rounded-2xl p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] flex items-center justify-center"><DollarSign className="w-6 h-6 text-white" /></div><div><p className="text-gray-400 text-sm">Total Revenue</p><p className="text-3xl font-display font-bold text-white">${stats.totalRevenue.toFixed(2)}</p></div></div></div>
          </div>
        ) : activeTab === 'products' ? (
          <div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-[rgba(0,212,255,0.1)]"><th className="px-6 py-4 text-left text-gray-400 font-medium">Product</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Category</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Price</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Status</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Actions</th></tr></thead><tbody>{products.map((product) => (<tr key={product.id} className="border-b border-[rgba(0,212,255,0.05)] hover:bg-[rgba(0,212,255,0.05)]"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] flex items-center justify-center">{product.category === 'rank' ? <Crown className="w-5 h-5 text-white" /> : product.category === 'key' ? <Key className="w-5 h-5 text-white" /> : <Package className="w-5 h-5 text-white" />}</div><div><p className="text-white font-medium">{product.name}</p><p className="text-gray-500 text-sm truncate max-w-xs">{product.description}</p></div></div></td><td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-medium uppercase bg-[rgba(0,212,255,0.1)] text-[#00d4ff]">{product.category}</span></td><td className="px-6 py-4 text-white font-bold">${product.price.toFixed(2)}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-medium ${product.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{product.active ? 'Active' : 'Disabled'}</span></td><td className="px-6 py-4"><button onClick={() => toggleProductActive(product.id, product.active)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${product.active ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>{product.active ? 'Disable' : 'Enable'}</button></td></tr>))}</tbody></table></div></div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-[rgba(0,212,255,0.1)]"><th className="px-6 py-4 text-left text-gray-400 font-medium">Order</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Customer</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Items</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Total</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Status</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Date</th><th className="px-6 py-4 text-left text-gray-400 font-medium">Actions</th></tr></thead><tbody>{orders.map((order) => (<tr key={order.id} className="border-b border-[rgba(0,212,255,0.05)] hover:bg-[rgba(0,212,255,0.05)]"><td className="px-6 py-4"><span className="text-white font-mono text-sm">{order.id.slice(0, 8)}...</span></td><td className="px-6 py-4"><div><p className="text-white font-medium">{order.minecraft_username}</p><p className="text-gray-500 text-sm">{order.email}</p></div></td><td className="px-6 py-4"><div className="flex flex-wrap gap-1">{order.order_items.map((item, i) => (<span key={i} className="px-2 py-1 rounded text-xs bg-[rgba(0,212,255,0.1)] text-[#00d4ff]">{item.product_name} x{item.quantity}</span>))}</div></td><td className="px-6 py-4 text-[#00d4ff] font-bold">${order.total.toFixed(2)}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>{order.status}</span></td><td className="px-6 py-4 text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</td><td className="px-6 py-4"><div className="flex items-center gap-2"><button onClick={() => setSelectedOrder(order)} className="p-2 rounded-lg bg-[rgba(0,212,255,0.1)] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.2)] transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>{order.status === 'pending' && (<><button onClick={() => { setOrderToConfirm(order); setShowConfirmModal(true); }} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors" title="Confirm & Deliver"><Send className="w-4 h-4" /></button><button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" title="Cancel"><X className="w-4 h-4" /></button></>)}</div></td></tr>))}</tbody></table></div></div>
        )}
        {selectedOrder && (<div className="modal-overlay" onClick={() => setSelectedOrder(null)}><div className="modal-content" onClick={(e) => e.stopPropagation()}><h2 className="font-display text-xl font-bold text-white mb-4">Order Details</h2><div className="space-y-4"><div><span className="text-gray-400">Order ID:</span><span className="text-white font-mono ml-2">{selectedOrder.id}</span></div><div><span className="text-gray-400">Username:</span><span className="text-white ml-2">{selectedOrder.minecraft_username}</span></div><div><span className="text-gray-400">Email:</span><span className="text-white ml-2">{selectedOrder.email}</span></div><div><span className="text-gray-400">Payment Method:</span><span className="text-white ml-2 uppercase">{selectedOrder.payment_method}</span></div><div><span className="text-gray-400">Status:</span><span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</span></div><div className="pt-4 border-t border-[rgba(0,212,255,0.1)]"><span className="text-gray-400 block mb-2">Items:</span><div className="space-y-2">{selectedOrder.order_items.map((item, i) => (<div key={i} className="flex justify-between items-center bg-[rgba(0,212,255,0.05)] rounded-lg p-3"><span className="text-white">{item.product_name}</span><div className="text-right"><span className="text-gray-400 text-sm">x{item.quantity}</span><span className="text-[#00d4ff] font-bold ml-4">${(item.price_at_time * item.quantity).toFixed(2)}</span></div></div>))}</div></div><div className="flex justify-between text-lg pt-4 border-t border-[rgba(0,212,255,0.1)]"><span className="text-gray-400">Total</span><span className="text-[#00d4ff] font-display font-bold text-2xl">${selectedOrder.total.toFixed(2)}</span></div></div><button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full mt-6">Close</button></div></div>)}
        {showConfirmModal && orderToConfirm && (<div className="modal-overlay" onClick={() => setShowConfirmModal(false)}><div className="modal-content" onClick={(e) => e.stopPropagation()}><h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-3"><Send className="w-6 h-6 text-[#10b981]" />Confirm Payment & Deliver</h2><div className="mb-6"><p className="text-gray-400">This will confirm the payment and send items to the player in-game.</p><div className="mt-4 p-4 bg-[rgba(0,212,255,0.05)] rounded-lg"><div className="flex justify-between mb-2"><span className="text-gray-400">Player:</span><span className="text-white font-medium">{orderToConfirm.minecraft_username}</span></div><div className="flex justify-between mb-2"><span className="text-gray-400">Total:</span><span className="text-[#00d4ff] font-bold">${orderToConfirm.total.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-gray-400">Items:</span><span className="text-white">{orderToConfirm.order_items.length}</span></div></div></div><div className="flex gap-4"><button onClick={() => confirmPaymentAndDeliver(orderToConfirm)} disabled={processing === orderToConfirm.id} className="btn-success flex-1 flex items-center justify-center gap-2">{processing === orderToConfirm.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Confirm & Deliver</button><button onClick={() => { setShowConfirmModal(false); setOrderToConfirm(null); }} className="btn-secondary flex-1">Cancel</button></div></div></div>)}
      </div>
    </div>
  );
}