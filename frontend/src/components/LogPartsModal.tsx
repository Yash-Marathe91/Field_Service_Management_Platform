import React, { useState, useEffect } from 'react';
import { X, PackagePlus, AlertTriangle } from 'lucide-react';
import api from '../api/client';
import type { Part } from '../types';

interface LogPartsModalProps {
  workOrderId: number;
  workOrderCode: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogPartsModal: React.FC<LogPartsModalProps> = ({
  workOrderId,
  workOrderCode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [loadingParts, setLoadingParts] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchParts();
    }
  }, [isOpen]);

  const fetchParts = async () => {
    try {
      setLoadingParts(true);
      const res = await api.get('/parts?size=100');
      setParts(res.data.content || []);
    } catch (err) {
      console.error('Failed to load parts catalog', err);
    } finally {
      setLoadingParts(false);
    }
  };

  if (!isOpen) return null;

  const selectedPart = parts.find((p) => p.id === Number(selectedPartId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartId) {
      setError('Please select a spare part from the catalog');
      return;
    }
    if (selectedPart && quantity > selectedPart.quantityOnHand) {
      setError(`Cannot log ${quantity} units. Only ${selectedPart.quantityOnHand} units available in stock.`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.post(`/work-orders/${workOrderId}/parts`, {
        partId: Number(selectedPartId),
        quantityUsed: Number(quantity),
        notes,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log part usage.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Log Parts / Material Usage</h2>
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
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Inventory Part *
            </label>
            {loadingParts ? (
              <div className="text-xs text-slate-400 py-2">Loading parts catalog...</div>
            ) : (
              <select
                required
                value={selectedPartId}
                onChange={(e) => {
                  setSelectedPartId(Number(e.target.value));
                  setError(null);
                }}
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Part from Inventory --</option>
                {parts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.partNumber}) - ${p.unitPrice.toFixed(2)} | Stock: {p.quantityOnHand}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedPart && (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-300">
                Unit Price: <span className="text-emerald-400 font-bold">${selectedPart.unitPrice.toFixed(2)}</span>
              </div>
              <div className="text-slate-300">
                Available Stock: <span className="text-white font-bold">{selectedPart.quantityOnHand}</span>
              </div>
              <div className="text-slate-400 pt-1 border-t border-slate-800">
                Estimated Line Cost:{' '}
                <span className="text-indigo-300 font-bold text-sm">
                  ${(selectedPart.unitPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quantity Used *
            </label>
            <input
              type="number"
              min="1"
              max={selectedPart ? selectedPart.quantityOnHand : 9999}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes / Location of Installation
            </label>
            <input
              type="text"
              placeholder="e.g., Replaced on primary compressor unit"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              disabled={submitting || !selectedPartId}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? 'Logging...' : 'Confirm & Deduct Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
