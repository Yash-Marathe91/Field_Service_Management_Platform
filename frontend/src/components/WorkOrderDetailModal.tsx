import React, { useState, useEffect } from 'react';
import type { WorkOrder, WorkOrderStatus, TimeLog, PartUsage, User, Priority } from '../types';
import { workOrderApi, userApi, default as api } from '../api/client';
import { X, Clock, AlertTriangle, Building, MapPin, History, PlayCircle, PauseCircle, CheckCircle2, XCircle, Wrench, PackagePlus, Edit2, Trash2, Save } from 'lucide-react';
import { LogTimeModal } from './LogTimeModal';
import { LogPartsModal } from './LogPartsModal';

interface WorkOrderDetailModalProps {
  workOrder: WorkOrder | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const WorkOrderDetailModal: React.FC<WorkOrderDetailModalProps> = ({
  workOrder,
  onClose,
  onRefresh
}) => {
  const [statusNotes, setStatusNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [partUsages, setPartUsages] = useState<PartUsage[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isPartsModalOpen, setIsPartsModalOpen] = useState(false);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('MEDIUM');
  const [editTechId, setEditTechId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (workOrder) {
      fetchLogsAndParts(workOrder.id);
      fetchTechs();
      setEditTitle(workOrder.title);
      setEditDescription(workOrder.description || '');
      setEditPriority(workOrder.priority);
      setEditTechId(workOrder.assignedTechId);
      setIsEditing(false);
    }
  }, [workOrder?.id]);

  const fetchTechs = async () => {
    try {
      const res = await userApi.getTechnicians();
      setTechnicians(res.data || []);
    } catch (err) {
      console.error('Failed to load technicians', err);
    }
  };

  const fetchLogsAndParts = async (id: number) => {
    try {
      const [tRes, pRes] = await Promise.all([
        api.get(`/work-orders/${id}/time-logs`),
        api.get(`/work-orders/${id}/parts`),
      ]);
      setTimeLogs(tRes.data || []);
      setPartUsages(pRes.data || []);
    } catch (err) {
      console.error('Failed to fetch time logs or parts', err);
    }
  };

  if (!workOrder) return null;

  const handleStatusChange = async (newStatus: WorkOrderStatus) => {
    setLoading(true);
    setError(null);
    try {
      await workOrderApi.updateStatus(workOrder.id, newStatus, statusNotes || undefined);
      setStatusNotes('');
      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await workOrderApi.updateWorkOrder(workOrder.id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        assignedTechId: editTechId
      });
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update work order details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkOrder = async () => {
    if (!window.confirm(`Are you sure you want to delete work order ${workOrder.code}?`)) return;
    setLoading(true);
    try {
      await workOrderApi.deleteWorkOrder(workOrder.id);
      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete work order');
    } finally {
      setLoading(false);
    }
  };

  const isSlaBreachedOrNear = (slaDueDate: string) => {
    const due = new Date(slaDueDate).getTime();
    const now = new Date().getTime();
    const hoursLeft = (due - now) / (1000 * 60 * 60);
    return { isBreached: hoursLeft < 0, hoursLeft: Math.max(0, Math.round(hoursLeft)) };
  };

  const { isBreached, hoursLeft } = isSlaBreachedOrNear(workOrder.slaDueDate);

  const formatMinutes = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const remainder = mins % 60;
    if (hrs === 0) return `${remainder}m`;
    return `${hrs}h ${remainder}m`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-3xl glass-panel p-6 bg-slate-900 border border-white/10 shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg">
                {workOrder.code}
              </span>
              <span className={`badge badge-${workOrder.priority.toLowerCase()}`}>
                {workOrder.priority} Priority
              </span>
              <span className={`badge badge-${workOrder.status.toLowerCase()}`}>
                {workOrder.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && workOrder.status !== 'COMPLETED' && workOrder.status !== 'CANCELLED' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
              )}
              <button
                onClick={handleDeleteWorkOrder}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30 cursor-pointer"
                title="Delete Work Order"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1 ml-1">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            
            {/* Editing Form vs Read View */}
            {isEditing ? (
              <form onSubmit={handleSaveChanges} className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-indigo-500/30">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Edit Work Order Details</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Order Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                    className="input-field bg-slate-900"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Technician</label>
                  <select
                    value={editTechId || ''}
                    onChange={(e) => setEditTechId(e.target.value ? Number(e.target.value) : undefined)}
                    className="input-field bg-slate-900"
                  >
                    <option value="">Unassigned (Queue)</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.fullName} ({tech.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="submit" disabled={loading} className="btn-primary bg-indigo-600 hover:bg-indigo-500">
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{workOrder.title}</h2>
                <p className="text-sm text-slate-300 bg-slate-950/60 border border-white/5 p-3 rounded-lg whitespace-pre-wrap">
                  {workOrder.description || 'No detailed description provided.'}
                </p>
              </div>
            )}

            {/* Customer & Location Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-2">
                  <Building className="h-4 w-4 text-cyan-400" /> Customer Organization
                </div>
                <div className="text-sm font-semibold text-white">{workOrder.customerName}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-2">
                  <MapPin className="h-4 w-4 text-amber-400" /> Site Facility
                </div>
                <div className="text-sm font-semibold text-white">{workOrder.siteName}</div>
                <div className="text-xs text-slate-400 mt-0.5">{workOrder.siteAddress}</div>
              </div>
            </div>

            {/* Assignee & SLA Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-2">
                  <Wrench className="h-4 w-4 text-indigo-400" /> Assigned Technician
                </div>
                <div className="text-sm font-semibold text-white">
                  {workOrder.assignedTechName || <span className="text-slate-500 italic">Unassigned (Queue)</span>}
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isBreached ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-950/40 border-white/5'
              }`}>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-2">
                  <Clock className="h-4 w-4 text-emerald-400" /> SLA Response Guarantee
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  {isBreached ? (
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 animate-pulse" /> SLA BREACHED
                    </span>
                  ) : (
                    <span>{hoursLeft} hours remaining</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Due by: {new Date(workOrder.slaDueDate).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Field Execution Metrics (Labor & Parts) */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-indigo-400" /> Field Execution & Costs
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTimeModalOpen(true)}
                    className="text-xs px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Clock className="h-3.5 w-3.5" /> + Log Time
                  </button>
                  <button
                    onClick={() => setIsPartsModalOpen(true)}
                    className="text-xs px-3 py-1.5 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
                  >
                    <PackagePlus className="h-3.5 w-3.5" /> + Log Part
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Labor Duration</div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {formatMinutes(workOrder.totalLaborMinutes || 0)}
                  </div>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Parts & Materials</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    ${(workOrder.totalPartsCost || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Logged Labor Entries */}
              {timeLogs.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300">Labor Logged Entries ({timeLogs.length})</div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {timeLogs.map((tl) => (
                      <div key={tl.id} className="p-2 bg-slate-950/60 rounded-lg text-xs flex justify-between items-center border border-slate-800">
                        <div>
                          <span className="font-semibold text-indigo-300">{tl.technicianName}</span>
                          <span className="text-slate-400 ml-2">{tl.workDescription || 'No details'}</span>
                        </div>
                        <span className="font-mono font-bold text-white shrink-0 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                          {formatMinutes(tl.minutes)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logged Parts Entries */}
              {partUsages.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300">Parts Used Entries ({partUsages.length})</div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {partUsages.map((pu) => (
                      <div key={pu.id} className="p-2 bg-slate-950/60 rounded-lg text-xs flex justify-between items-center border border-slate-800">
                        <div>
                          <span className="font-semibold text-white">{pu.partName}</span>
                          <span className="font-mono text-slate-400 ml-2">({pu.partNumber})</span>
                          <span className="text-slate-400 ml-2">x{pu.quantityUsed}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 shrink-0">
                          ${pu.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audit History Log */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-3">
                <History className="h-4 w-4 text-indigo-400" /> Lifecycle Audit History
              </div>
              
              <div className="space-y-3 pl-2 border-l-2 border-slate-800">
                {workOrder.history && workOrder.history.length > 0 ? (
                  workOrder.history.map((h) => (
                    <div key={h.id} className="relative pl-4 text-xs">
                      <div className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{h.fromStatus ? `${h.fromStatus} ➔ ${h.toStatus}` : `Status: ${h.toStatus}`}</span>
                        <span className="text-[10px] text-slate-500">{new Date(h.changedAt).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-400 mt-0.5">By: {h.changedByName}</div>
                      {h.notes && <div className="text-slate-300 bg-white/5 p-2 rounded mt-1 italic">{h.notes}</div>}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic">No status history recorded.</div>
                )}
              </div>
            </div>

            {/* Transition Action Controls */}
            {workOrder.status !== 'COMPLETED' && workOrder.status !== 'CANCELLED' && (
              <div className="border-t border-white/10 pt-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Status Update Notes / Log
                </label>
                <input
                  type="text"
                  placeholder="Optional status transition comments..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="input-field mb-3"
                />

                <div className="flex flex-wrap items-center gap-2">
                  {workOrder.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                      disabled={loading}
                      className="btn-primary bg-amber-600 hover:bg-amber-500 cursor-pointer"
                    >
                      <PlayCircle className="h-4 w-4" /> Start Work (In Progress)
                    </button>
                  )}
                  {workOrder.status === 'IN_PROGRESS' && (
                    <>
                      <button
                        onClick={() => handleStatusChange('ON_HOLD')}
                        disabled={loading}
                        className="btn-secondary text-purple-400 hover:bg-purple-500/20 cursor-pointer"
                      >
                        <PauseCircle className="h-4 w-4" /> Put On Hold
                      </button>
                      <button
                        onClick={() => handleStatusChange('COMPLETED')}
                        disabled={loading}
                        className="btn-primary bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Complete Work Order
                      </button>
                    </>
                  )}
                  {workOrder.status === 'ON_HOLD' && (
                    <button
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                      disabled={loading}
                      className="btn-primary bg-amber-600 hover:bg-amber-500 cursor-pointer"
                    >
                      <PlayCircle className="h-4 w-4" /> Resume Work
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusChange('CANCELLED')}
                    disabled={loading}
                    className="btn-secondary text-rose-400 hover:bg-rose-500/20 ml-auto cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" /> Cancel Order
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      <LogTimeModal
        workOrderId={workOrder.id}
        workOrderCode={workOrder.code}
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onSuccess={() => {
          fetchLogsAndParts(workOrder.id);
          onRefresh();
        }}
      />

      <LogPartsModal
        workOrderId={workOrder.id}
        workOrderCode={workOrder.code}
        isOpen={isPartsModalOpen}
        onClose={() => setIsPartsModalOpen(false)}
        onSuccess={() => {
          fetchLogsAndParts(workOrder.id);
          onRefresh();
        }}
      />
    </>
  );
};
