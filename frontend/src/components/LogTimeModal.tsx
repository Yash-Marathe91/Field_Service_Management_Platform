import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import api from '../api/client';

interface LogTimeModalProps {
  workOrderId: number;
  workOrderCode: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogTimeModal: React.FC<LogTimeModalProps> = ({
  workOrderId,
  workOrderCode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [minutes, setMinutes] = useState<number>(60);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes <= 0) {
      setError('Labor minutes must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.post(`/work-orders/${workOrderId}/time-logs`, {
        minutes: Number(minutes),
        workDescription: description,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log labor time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Log Field Labor Time</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-800/40">
            Work Order: <strong className="text-white">{workOrderCode}</strong>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Labor Duration (Minutes) *
            </label>
            <input
              type="number"
              min="1"
              max="1440"
              required
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2 mt-2">
              {[15, 30, 60, 120, 180].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMinutes(m)}
                  className="text-xs px-2.5 py-1 bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  +{m}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Work Description / Work Log
            </label>
            <textarea
              rows={3}
              placeholder="Describe tasks performed during this time window..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 pb-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Logging...' : 'Submit Labor Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
