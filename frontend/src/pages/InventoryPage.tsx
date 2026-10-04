import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, AlertTriangle, Layers, DollarSign, X, Edit2, Trash2 } from 'lucide-react';
import { partApi } from '../api/client';
import type { Part } from '../types';

export const InventoryPage: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  // Form State
  const [partNumber, setPartNumber] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantityOnHand, setQuantityOnHand] = useState<number>(10);
  const [minimumStockLevel, setMinimumStockLevel] = useState<number>(5);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchParts();
  }, [search]);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const res = await partApi.getParts({ search, size: 100 });
      setParts(res.data.content || []);
    } catch (err) {
      console.error('Failed to load parts catalog', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPart(null);
    setPartNumber('');
    setName('');
    setDescription('');
    setUnitPrice(0);
    setQuantityOnHand(10);
    setMinimumStockLevel(5);
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (part: Part) => {
    setEditingPart(part);
    setPartNumber(part.partNumber);
    setName(part.name);
    setDescription(part.description || '');
    setUnitPrice(part.unitPrice);
    setQuantityOnHand(part.quantityOnHand);
    setMinimumStockLevel(part.minimumStockLevel);
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError(null);

      const payload = {
        partNumber,
        name,
        description,
        unitPrice: Number(unitPrice),
        quantityOnHand: Number(quantityOnHand),
        minimumStockLevel: Number(minimumStockLevel),
      };

      if (editingPart) {
        await partApi.updatePart(editingPart.id, payload);
      } else {
        await partApi.createPart(payload);
      }

      setIsCreateModalOpen(false);
      fetchParts();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save inventory item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePart = async (id: number, partName: string) => {
    if (!window.confirm(`Are you sure you want to delete inventory item "${partName}"?`)) return;
    try {
      await partApi.deletePart(id);
      fetchParts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete part');
    }
  };

  const lowStockCount = parts.filter((p) => p.lowStock).length;
  const totalValue = parts.reduce((acc, p) => acc + p.unitPrice * p.quantityOnHand, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-indigo-400" /> Spare Parts & Inventory Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track component stock, automate low-stock threshold alerts, edit item details, and manage spare parts.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2 self-start md:self-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Inventory Part
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Part SKUs</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{parts.length}</div>
          </div>
        </div>

        <div className={`glass-panel p-4 rounded-xl border flex items-center gap-4 ${
          lowStockCount > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'border-slate-800'
        }`}>
          <div className={`p-3 rounded-lg border ${
            lowStockCount > 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Low Stock Reorder Alerts</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${lowStockCount > 0 ? 'text-amber-400' : 'text-white'}`}>
              {lowStockCount} SKUs
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Inventory Valuation</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">${totalValue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search inventory by Part Name or SKU number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Catalog Grid Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading spare parts catalog...</div>
        ) : parts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No parts found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="p-4">SKU / Part #</th>
                  <th className="p-4">Part Description & Name</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Min Reorder Level</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {parts.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-400">{part.partNumber}</td>
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{part.name}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">{part.description || 'No description'}</div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-emerald-400">${part.unitPrice.toFixed(2)}</td>
                    <td className="p-4 font-mono font-bold text-white text-sm">{part.quantityOnHand}</td>
                    <td className="p-4 font-mono text-slate-400">{part.minimumStockLevel}</td>
                    <td className="p-4 text-center">
                      {part.lowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> LOW STOCK
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          OPTIMAL
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(part)}
                          title="Edit Part"
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePart(part.id, part.name)}
                          title="Delete Part"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Part Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">
                  {editingPart ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h2>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Part SKU / Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COMP-102"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Part Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compressor Capacitor 45uF"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantityOnHand}
                    onChange={(e) => setQuantityOnHand(Number(e.target.value))}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Min Reorder Level *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minimumStockLevel}
                    onChange={(e) => setMinimumStockLevel(Number(e.target.value))}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingPart ? 'Update Part' : 'Create Part'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
