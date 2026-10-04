import type { WorkOrder, WorkOrderStatus } from '../types';
import { AlertTriangle, Clock, User, Building, MapPin, CheckCircle2, PauseCircle, PlayCircle } from 'lucide-react';

interface WorkOrderKanbanProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onUpdateStatus: (woId: number, status: WorkOrderStatus) => void;
}

const COLUMNS: { status: WorkOrderStatus; title: string; color: string }[] = [
  { status: 'NEW', title: 'New Unassigned', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/5' },
  { status: 'ASSIGNED', title: 'Assigned', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/5' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-amber-500/40 text-amber-400 bg-amber-500/5' },
  { status: 'ON_HOLD', title: 'On Hold', color: 'border-purple-500/40 text-purple-400 bg-purple-500/5' },
  { status: 'COMPLETED', title: 'Completed', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' },
  { status: 'CANCELLED', title: 'Cancelled', color: 'border-rose-500/40 text-rose-400 bg-rose-500/5' },
];

export const WorkOrderKanban: React.FC<WorkOrderKanbanProps> = ({
  workOrders,
  onSelectWorkOrder,
  onUpdateStatus
}) => {

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'badge-urgent';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const isSlaBreachedOrNear = (slaDueDate: string) => {
    const due = new Date(slaDueDate).getTime();
    const now = new Date().getTime();
    const hoursLeft = (due - now) / (1000 * 60 * 60);
    return { isBreached: hoursLeft < 0, hoursLeft };
  };

  return (
    <div className="flex gap-4 pb-6 overflow-x-auto min-w-full items-start">
      {COLUMNS.map((col) => {
        const colOrders = workOrders.filter((wo) => wo.status === col.status);

        return (
          <div
            key={col.status}
            className="flex flex-col rounded-xl border border-white/10 bg-slate-900/60 p-3 w-80 shrink-0 h-[calc(100vh-230px)] min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between p-2.5 mb-3 rounded-lg border ${col.color} font-semibold text-xs uppercase tracking-wider`}>
              <span>{col.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[11px]">
                {colOrders.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {colOrders.length === 0 ? (
                <div className="flex h-32 items-center justify-center border border-dashed border-white/10 rounded-lg text-slate-500 text-xs">
                  No work orders
                </div>
              ) : (
                colOrders.map((wo) => {
                  const { isBreached, hoursLeft } = isSlaBreachedOrNear(wo.slaDueDate);

                  return (
                    <div
                      key={wo.id}
                      onClick={() => onSelectWorkOrder(wo)}
                      className="group relative cursor-pointer glass-panel glass-panel-hover p-3.5 transition-all rounded-xl"
                    >
                      {/* Priority & Code */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 tracking-wide">
                          {wo.code}
                        </span>
                        <span className={`badge ${getPriorityBadgeClass(wo.priority)}`}>
                          {wo.priority}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                        {wo.title}
                      </h4>

                      {/* Customer & Site */}
                      <div className="space-y-1 text-xs text-slate-400 mb-3">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate text-slate-300">{wo.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{wo.siteName}</span>
                        </div>
                      </div>

                      {/* SLA & Assignee */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-500" />
                          <span className="truncate max-w-[100px]">
                            {wo.assignedTechName || 'Unassigned'}
                          </span>
                        </div>

                        {/* SLA Indicator */}
                        <div className={`flex items-center gap-1 font-mono font-medium ${
                          isBreached ? 'text-rose-400 font-bold' : hoursLeft < 4 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          {isBreached ? (
                            <>
                              <AlertTriangle className="h-3 w-3 text-rose-400 animate-pulse" />
                              <span>BREACHED</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3" />
                              <span>{Math.max(0, Math.round(hoursLeft))}h left</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quick Status Action Controls */}
                      <div className="mt-3 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity border-t border-white/10 pt-2">
                        {wo.status === 'ASSIGNED' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(wo.id, 'IN_PROGRESS'); }}
                            className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded text-[10px] font-bold transition-colors"
                          >
                            <PlayCircle className="h-3 w-3" /> Start
                          </button>
                        )}
                        {wo.status === 'IN_PROGRESS' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); onUpdateStatus(wo.id, 'ON_HOLD'); }}
                              className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded text-[10px] font-bold transition-colors"
                            >
                              <PauseCircle className="h-3 w-3" /> Hold
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onUpdateStatus(wo.id, 'COMPLETED'); }}
                              className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded text-[10px] font-bold transition-colors"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Complete
                            </button>
                          </>
                        )}
                        {wo.status === 'ON_HOLD' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(wo.id, 'IN_PROGRESS'); }}
                            className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded text-[10px] font-bold transition-colors"
                          >
                            <PlayCircle className="h-3 w-3" /> Resume
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
