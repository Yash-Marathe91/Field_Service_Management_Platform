import React, { useEffect, useState } from 'react';
import { workOrderApi } from '../api/client';
import type { WorkOrder, WorkOrderStatus } from '../types';
import { WorkOrderKanban } from '../components/WorkOrderKanban';
import { CreateWorkOrderModal } from '../components/CreateWorkOrderModal';
import { WorkOrderDetailModal } from '../components/WorkOrderDetailModal';
import { LayoutGrid, List, Search, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export const WorkOrdersPage: React.FC<{ onOpenCreateModal: () => void; isCreateOpen: boolean; setIsCreateOpen: (v: boolean) => void }> = ({
  isCreateOpen,
  setIsCreateOpen
}) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const response = await workOrderApi.getWorkOrders({
        search: search || undefined,
        status: statusFilter ? (statusFilter as WorkOrderStatus) : undefined,
        size: 100
      });
      setWorkOrders(response.data.content);
    } catch (error) {
      console.error('Failed to fetch work orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (woId: number, status: WorkOrderStatus) => {
    try {
      await workOrderApi.updateStatus(woId, status);
      fetchWorkOrders();
    } catch (err) {
      console.error('Failed status transition:', err);
    }
  };

  // Metrics
  const inProgressCount = workOrders.filter(w => w.status === 'IN_PROGRESS').length;
  const breachedCount = workOrders.filter(w => new Date(w.slaDueDate).getTime() < new Date().getTime() && w.status !== 'COMPLETED' && w.status !== 'CANCELLED').length;

  return (
    <div className="space-y-6">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-indigo-500">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{workOrders.length}</div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Active Orders</div>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-amber-500">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{inProgressCount}</div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Currently In Progress</div>
          </div>
        </div>

        <div className="glass-panel p-4 flex items-center gap-4 border-l-4 border-rose-500">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-400">{breachedCount}</div>
            <div className="text-xs text-slate-400 uppercase font-semibold">SLA Breached Warnings</div>
          </div>
        </div>
      </div>

      {/* Action Controls & Filters */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search & Filter */}
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search WO code, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-2 bg-slate-800 text-white font-medium pr-8"
            >
              <option value="">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <button onClick={fetchWorkOrders} className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/5">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-white/10 rounded-lg">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Board
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="h-3.5 w-3.5" /> Table
          </button>
        </div>

      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400 text-sm">
          Loading work orders...
        </div>
      ) : viewMode === 'kanban' ? (
        <WorkOrderKanban
          workOrders={workOrders}
          onSelectWorkOrder={(wo) => setSelectedWorkOrder(wo)}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        /* Table View */
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-white/10">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Title</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Customer & Site</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">SLA Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {workOrders.map((wo) => (
                <tr
                  key={wo.id}
                  onClick={() => setSelectedWorkOrder(wo)}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-cyan-400">{wo.code}</td>
                  <td className="p-4 font-semibold text-white max-w-xs truncate">{wo.title}</td>
                  <td className="p-4">
                    <span className={`badge badge-${wo.priority.toLowerCase()}`}>{wo.priority}</span>
                  </td>
                  <td className="p-4">
                    <span className={`badge badge-${wo.status.toLowerCase()}`}>{wo.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-200">{wo.customerName}</div>
                    <div className="text-[11px] text-slate-400">{wo.siteName}</div>
                  </td>
                  <td className="p-4 text-slate-300">{wo.assignedTechName || 'Unassigned'}</td>
                  <td className="p-4 font-mono text-slate-400">
                    {new Date(wo.slaDueDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateWorkOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchWorkOrders}
      />

      <WorkOrderDetailModal
        workOrder={selectedWorkOrder}
        onClose={() => setSelectedWorkOrder(null)}
        onRefresh={fetchWorkOrders}
      />

    </div>
  );
};
