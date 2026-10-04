import React, { useEffect, useState } from 'react';
import { customerApi, siteApi, userApi, workOrderApi } from '../api/client';
import type { Customer, Priority, Site, User } from '../types';
import { X, Plus, Building, MapPin, UserCheck, AlertCircle } from 'lucide-react';

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [selectedSiteId, setSelectedSiteId] = useState<number | ''>('');
  const [assignedTechId, setAssignedTechId] = useState<number | ''>('');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCustomersAndTechs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchSitesForCustomer(Number(selectedCustomerId));
    } else {
      setSites([]);
    }
  }, [selectedCustomerId]);

  const fetchCustomersAndTechs = async () => {
    try {
      const [custRes, techRes] = await Promise.all([
        customerApi.getCustomers({ size: 100 }),
        userApi.getTechnicians()
      ]);
      setCustomers(custRes.data.content);
      setTechnicians(techRes.data);
    } catch {
      setError('Failed to load customers or technicians.');
    }
  };

  const fetchSitesForCustomer = async (custId: number) => {
    try {
      const res = await siteApi.getSitesByCustomer(custId);
      setSites(res.data);
    } catch {
      setSites([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedCustomerId || !selectedSiteId) {
      setError('Please fill in all required fields (Title, Customer, Site).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await workOrderApi.createWorkOrder({
        title,
        description,
        priority,
        customerId: Number(selectedCustomerId),
        siteId: Number(selectedSiteId),
        assignedTechId: assignedTechId ? Number(assignedTechId) : undefined
      });
      onSuccess();
      onClose();
      // Reset
      setTitle('');
      setDescription('');
      setSelectedCustomerId('');
      setSelectedSiteId('');
      setAssignedTechId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create work order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel p-6 bg-slate-900 border border-white/10 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create Work Order</h3>
              <p className="text-xs text-slate-400">Dispatch a new service request with SLA tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., HVAC Chiller System High Pressure Alarm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Provide issue details, error codes, or access instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
            />
          </div>

          {/* Customer & Site Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-cyan-400" /> Customer <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : '')}
                className="input-field bg-slate-800 text-white"
                required
              >
                <option value="">Select Customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-400" /> Site / Facility <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value ? Number(e.target.value) : '')}
                className="input-field bg-slate-800 text-white disabled:opacity-50"
                disabled={!selectedCustomerId}
                required
              >
                <option value="">{selectedCustomerId ? 'Select Site...' : 'Select Customer first'}</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.address})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Priority (SLA Target)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="input-field bg-slate-800 text-white font-medium"
              >
                <option value="LOW">LOW (SLA: 48 hours)</option>
                <option value="MEDIUM">MEDIUM (SLA: 24 hours)</option>
                <option value="HIGH">HIGH (SLA: 8 hours)</option>
                <option value="URGENT">URGENT (SLA: 2 hours)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-indigo-400" /> Assign Technician
              </label>
              <select
                value={assignedTechId}
                onChange={(e) => setAssignedTechId(e.target.value ? Number(e.target.value) : '')}
                className="input-field bg-slate-800 text-white"
              >
                <option value="">Unassigned (Queue)</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Dispatching...' : 'Dispatch Work Order'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
