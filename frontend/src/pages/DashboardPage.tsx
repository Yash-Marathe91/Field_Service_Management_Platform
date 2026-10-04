import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, CheckCircle2, Clock, Wrench, Users, DollarSign, Activity } from 'lucide-react';
import api from '../api/client';
import type { DashboardMetrics } from '../types';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/metrics');
      setMetrics(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load executive metrics');
    } finally {
      setLoading(false);
    }
  };

  const formatLaborHours = (mins: number) => {
    const hrs = (mins / 60).toFixed(1);
    return `${hrs} hrs`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 text-sm">
        Calculating operations analytics & SLA metrics...
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-sm">
        {error || 'Unable to display metrics dashboard.'}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-indigo-400" /> Executive Analytics & Field Performance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time operations metrics, SLA breach tracking, dispatch load balancing, and inventory spend analytics.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Active Orders */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Active Work Orders</div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {metrics.activeWorkOrders} <span className="text-xs font-normal text-slate-400">/ {metrics.totalWorkOrders} total</span>
            </div>
          </div>
        </div>

        {/* SLA Breached Orders */}
        <div className={`glass-panel p-5 rounded-2xl border flex items-center gap-4 ${
          metrics.slaBreachedOrders > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'border-slate-800'
        }`}>
          <div className={`p-3.5 rounded-xl border shrink-0 ${
            metrics.slaBreachedOrders > 0 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">SLA Breaches</div>
            <div className={`text-2xl font-black font-mono mt-1 ${metrics.slaBreachedOrders > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {metrics.slaBreachedOrders}
            </div>
          </div>
        </div>

        {/* Total Parts Spend */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Parts Spend</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              ${(metrics.totalPartsCostAllTime || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Total Labor Hours */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Field Labor</div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {formatLaborHours(metrics.totalLaborMinutesAllTime)}
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Work Order Status Breakdown
          </h2>
          
          <div className="space-y-4 pt-2">
            {Object.entries(metrics.statusBreakdown).map(([status, count]) => {
              const percentage = metrics.totalWorkOrders > 0 ? Math.round((count / metrics.totalWorkOrders) * 100) : 0;
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200 font-mono tracking-wide">{status}</span>
                    <span className="text-slate-300 font-mono">{count} order{count !== 1 ? 's' : ''} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="h-4 w-4 text-amber-400" /> Priority Severity Distribution
          </h2>

          <div className="space-y-4 pt-2">
            {Object.entries(metrics.priorityBreakdown).map(([priority, count]) => {
              const percentage = metrics.totalWorkOrders > 0 ? Math.round((count / metrics.totalWorkOrders) * 100) : 0;
              const colorMap: Record<string, string> = {
                URGENT: 'from-rose-600 to-red-400',
                HIGH: 'from-amber-600 to-orange-400',
                MEDIUM: 'from-blue-600 to-cyan-400',
                LOW: 'from-slate-600 to-slate-400',
              };
              return (
                <div key={priority} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200 font-mono tracking-wide">{priority}</span>
                    <span className="text-slate-300 font-mono">{count} order{count !== 1 ? 's' : ''} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r ${colorMap[priority] || 'from-indigo-500 to-cyan-400'} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Technician Workload Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" /> Active Field Technician Workload Dispatch
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{metrics.technicianWorkload.length} Technicians</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="p-3.5">Technician Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Active Assigned Orders</th>
                <th className="p-3.5 text-right">Workload Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {metrics.technicianWorkload.map((tech) => (
                <tr key={tech.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">{tech.name}</td>
                  <td className="p-3.5 font-mono text-slate-400">{tech.email}</td>
                  <td className="p-3.5 font-mono font-bold text-indigo-300 text-sm">
                    {tech.activeAssignedOrders} order{tech.activeAssignedOrders !== 1 ? 's' : ''}
                  </td>
                  <td className="p-3.5 text-right">
                    {tech.activeAssignedOrders >= 4 ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        HEAVY LOAD
                      </span>
                    ) : tech.activeAssignedOrders > 0 ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        OPTIMAL
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        AVAILABLE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
