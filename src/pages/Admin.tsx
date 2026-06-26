import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminStore } from '../lib/store';

export default function Admin() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAdminStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isLoggedIn) navigate('/admin/dashboard'); }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!username || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    const success = await login(username, password);
    if (success) navigate('/admin/dashboard');
    else setError('Invalid credentials');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] flex items-center justify-center"><Shield className="w-8 h-8 text-white" /></div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm mt-2">Restricted access - Authorized personnel only</p>
          </div>
          {error && (<div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><span className="text-red-400">{error}</span></div>)}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="flex items-center gap-2 mb-2"><User className="w-4 h-4 text-[#00d4ff]" />Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Admin username" /></div>
            <div><label className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-[#00d4ff]" />Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">{loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Authenticating...</>) : ('Login')}</button>
          </form>
        </div>
      </div>
    </div>
  );
}