import React, { useEffect, useState } from 'react';
import { customerApi, siteApi } from '../api/client';
import type { Customer, Site } from '../types';
import { Building2, MapPin, Plus, Search, Mail, User, Phone, Map, Edit2, Trash2, X } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Modal States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custContact, setCustContact] = useState('');

  // Site Modal States
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [siteName, setSiteName] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [siteCode, setSiteCode] = useState('');
  const [siteContact, setSiteContact] = useState('');
  const [sitePhone, setSitePhone] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getCustomers({ search: search || undefined });
      setCustomers(res.data.content);
      if (res.data.content.length > 0 && !selectedCustomer) {
        setSelectedCustomer(res.data.content[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async (custId: number) => {
    try {
      const res = await siteApi.getSitesByCustomer(custId);
      setSites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  useEffect(() => {
    if (selectedCustomer) {
      fetchSites(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  const openCreateCustomerModal = () => {
    setEditingCustomer(null);
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustAddress('');
    setCustContact('');
    setIsCustomerModalOpen(true);
  };

  const openEditCustomerModal = (c: Customer) => {
    setEditingCustomer(c);
    setCustName(c.name);
    setCustEmail(c.email || '');
    setCustPhone(c.phone || '');
    setCustAddress(c.address || '');
    setCustContact(c.contactPerson || '');
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: custName,
        email: custEmail,
        phone: custPhone,
        address: custAddress,
        contactPerson: custContact
      };
      if (editingCustomer) {
        const res = await customerApi.updateCustomer(editingCustomer.id, payload);
        setSelectedCustomer(res.data);
      } else {
        const created = await customerApi.createCustomer(payload);
        setSelectedCustomer(created.data);
      }
      setIsCustomerModalOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomer = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) return;
    try {
      await customerApi.deleteCustomer(id);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  const openCreateSiteModal = () => {
    setEditingSite(null);
    setSiteName('');
    setSiteAddress('');
    setSiteCode('');
    setSiteContact('');
    setSitePhone('');
    setIsSiteModalOpen(true);
  };

  const openEditSiteModal = (s: Site) => {
    setEditingSite(s);
    setSiteName(s.name);
    setSiteAddress(s.address);
    setSiteCode(s.buildingCode || '');
    setSiteContact(s.contactPerson || '');
    setSitePhone(s.contactPhone || '');
    setIsSiteModalOpen(true);
  };

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      const payload = {
        customerId: selectedCustomer.id,
        name: siteName,
        address: siteAddress,
        buildingCode: siteCode,
        contactPerson: siteContact,
        contactPhone: sitePhone
      };
      if (editingSite) {
        await siteApi.updateSite(editingSite.id, payload);
      } else {
        await siteApi.createSite(payload);
      }
      setIsSiteModalOpen(false);
      fetchSites(selectedCustomer.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSite = async (siteId: number, siteName: string) => {
    if (!window.confirm(`Are you sure you want to delete site "${siteName}"?`)) return;
    try {
      await siteApi.deleteSite(siteId);
      if (selectedCustomer) fetchSites(selectedCustomer.id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete site');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      
      {/* Left Column: Customers Directory */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-400" /> Customers Directory
          </h2>
          <button
            onClick={openCreateCustomerModal}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 py-2"
          />
        </div>

        <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center text-xs text-slate-500 py-6">Loading directory...</div>
          ) : customers.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-6">No customers found.</div>
          ) : (
            customers.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedCustomer?.id === c.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'glass-panel glass-panel-hover border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{c.name}</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditCustomerModal(c); }}
                      title="Edit Customer"
                      className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(c.id, c.name); }}
                      title="Delete Customer"
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{c.contactPerson || 'No contact person'}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{c.email || 'No email registered'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Customer Details & Sites / Facilities */}
      <div className="lg:col-span-8 space-y-6">
        {selectedCustomer ? (
          <>
            {/* Customer Details Banner */}
            <div className="glass-panel p-6 border-l-4 border-indigo-500 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{selectedCustomer.name}</h1>
                    <button
                      onClick={() => openEditCustomerModal(selectedCustomer)}
                      className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors cursor-pointer"
                      title="Edit Customer Details"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(selectedCustomer.id, selectedCustomer.name)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                      title="Delete Customer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Map className="h-3.5 w-3.5 text-slate-500" />
                    <span>{selectedCustomer.address || 'Corporate address not listed'}</span>
                  </p>
                </div>
                <button
                  onClick={openCreateSiteModal}
                  className="btn-primary text-xs bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Facility Site
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 uppercase font-semibold text-[11px] block">Primary Contact</span>
                  <div className="text-white font-medium flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{selectedCustomer.contactPerson || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 uppercase font-semibold text-[11px] block">Email Address</span>
                  <div className="text-white font-medium flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="truncate">{selectedCustomer.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 uppercase font-semibold text-[11px] block">Phone Number</span>
                  <div className="text-white font-medium flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-amber-400" />
                    <span>{selectedCustomer.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sites List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" /> Managed Customer Sites ({sites.length})
              </h3>

              {sites.length === 0 ? (
                <div className="glass-panel p-8 text-center text-xs text-slate-400 rounded-2xl">
                  No facility sites registered for this customer yet. Click "Add Facility Site" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sites.map((site) => (
                    <div key={site.id} className="glass-panel p-5 border border-white/10 rounded-2xl space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{site.name}</span>
                        <div className="flex items-center gap-1">
                          {site.buildingCode && (
                            <span className="font-mono text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                              {site.buildingCode}
                            </span>
                          )}
                          <button
                            onClick={() => openEditSiteModal(site)}
                            className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Edit Site"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSite(site.id, site.name)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Site"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{site.address}</span>
                      </p>
                      <div className="border-t border-white/5 pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Contact: <strong className="text-slate-300 font-semibold">{site.contactPerson || 'Facility Admin'}</strong></span>
                        <span className="font-mono">{site.contactPhone || ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="glass-panel h-64 flex items-center justify-center text-slate-500 text-sm rounded-2xl">
            Select a customer from the directory to view details & sites.
          </div>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Organization Name *</label>
                <input type="text" placeholder="e.g. Apex Commercial Properties" value={custName} onChange={(e) => setCustName(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input type="email" placeholder="facilities@apex.com" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input type="text" placeholder="+1-555-0192" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Address</label>
                <input type="text" placeholder="100 Tech Parkway, Suite 400" value={custAddress} onChange={(e) => setCustAddress(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Contact Person</label>
                <input type="text" placeholder="Marcus Vance" value={custContact} onChange={(e) => setCustContact(e.target.value)} className="input-field" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary cursor-pointer">{editingCustomer ? 'Update Customer' : 'Save Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Site Modal */}
      {isSiteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingSite ? `Edit Site for ${selectedCustomer.name}` : `Add Facility Site for ${selectedCustomer.name}`}
              </h3>
              <button onClick={() => setIsSiteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSite} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Facility / Site Name *</label>
                <input type="text" placeholder="e.g. Metro Tower North" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Address *</label>
                <input type="text" placeholder="742 Evergreen Terrace" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Building / Gate Code</label>
                <input type="text" placeholder="e.g. MT-NORTH" value={siteCode} onChange={(e) => setSiteCode(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Site Contact Person</label>
                <input type="text" placeholder="Marcus Vance" value={siteContact} onChange={(e) => setSiteContact(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Site Phone Number</label>
                <input type="text" placeholder="+1-555-0192" value={sitePhone} onChange={(e) => setSitePhone(e.target.value)} className="input-field" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsSiteModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary cursor-pointer">{editingSite ? 'Update Site' : 'Save Site'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
