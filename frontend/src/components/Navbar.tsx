import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, LogOut, LayoutDashboard, PlusCircle, Building2, Package, BarChart3 } from 'lucide-react';

interface NavbarProps {
  onOpenCreateWorkOrder?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateWorkOrder }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const roleColors: Record<string, string> = {
    MANAGER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    DISPATCHER: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    TECHNICIAN: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    CUSTOMER: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg font-bold tracking-tight text-white leading-tight">KEYSTONE</span>
              <span className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase leading-none mt-0.5">
                Field Service Ops
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/work-orders"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === '/work-orders' || location.pathname === '/'
                  ? 'bg-white/10 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 text-indigo-400" />
              <span>Work Orders</span>
            </Link>

            {(user.role === 'MANAGER' || user.role === 'DISPATCHER') && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="h-4 w-4 shrink-0 text-cyan-400" />
                <span>Analytics</span>
              </Link>
            )}

            {user.role !== 'CUSTOMER' && (
              <Link
                to="/customers"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/customers'
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Customers & Sites</span>
              </Link>
            )}

            {user.role !== 'CUSTOMER' && (
              <Link
                to="/inventory"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === '/inventory'
                    ? 'bg-white/10 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Inventory & Parts</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Action Controls & User Info */}
        <div className="flex items-center gap-4">
          
          {onOpenCreateWorkOrder && (
            <button
              onClick={onOpenCreateWorkOrder}
              className="btn-primary shadow-lg flex items-center gap-2 px-4 py-2 text-xs font-bold"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>New Work Order</span>
            </button>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-white leading-tight">{user.fullName}</div>
              <div className="text-xs text-slate-400 leading-none mt-0.5">{user.email}</div>
            </div>

            <span className={`px-2.5 py-0.5 text-[11px] font-bold tracking-wider rounded-full border ${roleColors[user.role] || 'bg-slate-800 text-slate-300'}`}>
              {user.role}
            </span>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
