import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { Wrench, ArrowRight, KeyRound, Mail, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const { token, userId, ...userData } = response.data;
      login(token, { id: userId, email: userData.email, fullName: userData.fullName, role: userData.role, customerId: userData.customerId });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-xl shadow-indigo-500/30 mb-4">
            <Wrench className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">KEYSTONE</h1>
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mt-1">
            Field Service Management Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 shadow-2xl border border-white/10 rounded-3xl bg-slate-900/80">
          
          <h2 className="text-lg font-bold text-white mb-6">Sign In to Workspace</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 py-2.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 py-2.5"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 mt-2 text-sm font-bold shadow-indigo-500/30 flex items-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <UserCheck className="h-4 w-4 text-indigo-400" /> 1-Click Demo Accounts (Password: password123)
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@meridian.com')}
                className="p-3 text-left bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all group"
              >
                <span className="block text-xs font-bold text-purple-300 group-hover:text-purple-200">Manager</span>
                <span className="block text-[11px] font-normal text-slate-400 truncate mt-0.5">admin@meridian.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dispatcher@meridian.com')}
                className="p-3 text-left bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all group"
              >
                <span className="block text-xs font-bold text-indigo-300 group-hover:text-indigo-200">Dispatcher</span>
                <span className="block text-[11px] font-normal text-slate-400 truncate mt-0.5">dispatcher@meridian.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('tech1@meridian.com')}
                className="p-3 text-left bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all group"
              >
                <span className="block text-xs font-bold text-amber-300 group-hover:text-amber-200">Technician</span>
                <span className="block text-[11px] font-normal text-slate-400 truncate mt-0.5">tech1@meridian.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('client@apexproperties.com')}
                className="p-3 text-left bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all group"
              >
                <span className="block text-xs font-bold text-cyan-300 group-hover:text-cyan-200">Customer</span>
                <span className="block text-[11px] font-normal text-slate-400 truncate mt-0.5">client@apexproperties.com</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
