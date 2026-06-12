import { useState } from 'react';
import { Store, Plus, Filter, Download, MoreVertical, ChevronLeft, ChevronRight, CalendarDays, FileText, Edit } from 'lucide-react';

const proposals = [
  {
    id: 1,
    store: 'Milan Flagship',
    storeId: '#8821',
    isNew: true,
    promo: 'In-Store Flash Sale: 15%',
    description: 'Store seeks approval for a weekend clearance of previous season footwear.',
  },
  {
    id: 2,
    store: 'Paris Boutique',
    storeId: '#4402',
    isNew: true,
    promo: 'VIP Private Event: 20%',
    description: 'Exclusive discount for top-tier clientele attending the trunk show.',
  },
];

const campaigns = [
  {
    name: 'Spring Refresh 10%',
    type: 'Percentage Discount',
    origin: 'Admin',
    originInitial: 'A',
    originColor: 'bg-[#3C6BED] text-[#FFFBFF]',
    duration: 'Mar 01 – Apr 15',
    status: 'Expired',
    statusBg: 'bg-[#E2E1ED] text-[#434654]',
  },
  {
    name: 'London Pop-up Special',
    type: 'Flash Sale',
    origin: 'London #12',
    originInitial: 'L',
    originColor: 'bg-[#EDEDF8] text-[#434654]',
    duration: 'May 12 – May 14',
    status: 'Active',
    statusBg: 'bg-[#6CF8BB] text-[#191B23]',
  },
  {
    name: 'Welcome Gift Card',
    type: 'Fixed Amount',
    origin: 'Admin',
    originInitial: 'A',
    originColor: 'bg-[#3C6BED] text-[#FFFBFF]',
    duration: 'Ongoing',
    status: 'Active',
    statusBg: 'bg-[#6CF8BB] text-[#191B23]',
  },
];

const activePromotions = [
  {
    label: 'GLOBAL ADMIN OFFER',
    title: 'Summer Sale 20% Off',
    status: 'Live Globally',
    statusColor: 'text-[#006C49]',
  },
  {
    label: 'REGIONAL STORE OFFER',
    title: 'Luxury Tier Loyalty',
    status: 'Live in 12 Stores',
    statusColor: 'text-[#006C49]',
  },
];

const scheduledPromotions = [
  {
    month: 'SEP',
    day: '01',
    title: 'Fashion Week Blitz',
    meta: 'Admin Created \u2022 Global',
  },
  {
    month: 'OCT',
    day: '24',
    title: 'Fall Launch Promo',
    meta: 'Store Proposal \u2022 Pending',
  },
];

export default function PromotionsSection() {
  const [page, setPage] = useState(1);
  const totalPages = 12;

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8 max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Promotions &amp; Discounts</h1>
            <p className="text-sm text-admin-text-secondary mt-1">Manage incoming discount proposals and oversee active campaigns.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#4F7CFF] text-white rounded-2xl text-base font-bold shadow-[0_10px_15px_-3px_rgba(21,80,211,0.2),0_4px_6px_-4px_rgba(21,80,211,0.2)] hover:bg-[#4F7CFF]/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Create Admin Offer
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-[1fr_296px] gap-6">

          {/* Left Column */}
          <div className="flex flex-col gap-6">

            {/* New Store Proposals */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-medium text-admin-text-primary tracking-[-0.2px]">New Store Proposals</h2>
                <span className="px-3 py-1 bg-admin-brand/10 rounded-full text-[10px] font-bold text-admin-brand uppercase tracking-[0.5px]">4 Pending Review</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {proposals.map((p) => (
                  <div key={p.id} className="bg-[#FAF8FF] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-admin-profile rounded-lg flex items-center justify-center">
                          <Store className="w-[18px] h-4 text-admin-text-secondary" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-admin-text-primary">{p.store}</p>
                          <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[-0.25px]">{p.storeId}</p>
                        </div>
                      </div>
                      {p.isNew && (
                        <span className="px-2 py-0.5 bg-[#FFDDB8] rounded text-[10px] font-bold text-[#2A1700]">NEW</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-admin-brand">{p.promo}</p>
                      <p className="text-xs font-medium text-admin-text-secondary tracking-[0.24px] mt-1">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* TODO: Connect proposal approval endpoint */}
                      <button className="flex-1 py-2 bg-admin-brand text-white rounded-lg text-xs font-bold tracking-[0.24px] hover:bg-admin-brand-light transition-colors">Approve</button>
                      {/* TODO: Open proposal details drawer */}
                      <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-xs font-bold text-admin-text-primary tracking-[0.24px] hover:bg-white transition-colors">Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotion History */}
            <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#E5E7EB]">
                <div>
                  <h2 className="text-lg font-bold text-admin-text-primary">Promotion History</h2>
                  <p className="text-xs font-medium text-admin-text-secondary tracking-[0.24px] mt-0.5">Full record of all store-proposed and admin-issued discounts.</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* TODO: Connect filter functionality */}
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-medium text-admin-text-primary hover:bg-[#FAF8FF] transition-colors">
                    <Filter className="w-3.5 h-3" />
                    Filter
                  </button>
                  {/* TODO: Connect export functionality */}
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-medium text-admin-text-primary hover:bg-[#FAF8FF] transition-colors">
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="bg-admin-category border-b border-[#E5E7EB]">
                    <th className="py-4 px-6 text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.5px]">Campaign Name</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.5px]">Origin</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.5px]">Duration</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.5px]">Status</th>
                    <th className="py-4 px-6 text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0.5px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr key={i} className="border-b border-[#E5E7EB] last:border-b-0">
                      <td className="py-4 px-6">
                        <p className="text-sm font-bold text-admin-text-primary">{c.name}</p>
                        <p className="text-[11px] text-admin-text-secondary">{c.type}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${c.originColor}`}>
                            {c.originInitial}
                          </div>
                          <span className="text-sm text-admin-text-primary">{c.origin}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-admin-text-secondary">{c.duration}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${c.statusBg}`}>{c.status}</span>
                      </td>
                      <td className="py-4 px-6">
                        {/* TODO: Connect view/edit/archive actions */}
                        <button className="p-1 rounded-full hover:bg-admin-brand-activeBg transition-colors">
                          <MoreVertical className="w-4 h-4 text-admin-text-secondary" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#F3F3FE] border-t border-[#E5E7EB]">
                <span className="text-xs font-medium text-admin-text-secondary tracking-[0.24px]">114 campaigns</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="w-5 h-5 flex items-center justify-center border border-[#E5E7EB] rounded hover:bg-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3 text-admin-text-primary" />
                  </button>
                  <span className="text-xs font-medium text-admin-text-secondary px-2">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="w-5 h-5 flex items-center justify-center border border-[#E5E7EB] rounded hover:bg-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-admin-text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Active Management */}
            <div className="bg-[#FAF8FF] border border-[#E5E7EB] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-admin-text-primary mb-6">Active Management</h2>
              <div className="flex flex-col gap-4">
                {activePromotions.map((p, i) => (
                  <div key={i} className="bg-admin-profile rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-admin-text-secondary uppercase tracking-[0px]">{p.label}</p>
                    <p className="text-base font-bold text-admin-text-primary mt-1">{p.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs font-bold tracking-[0.24px] ${p.statusColor}`}>{p.status}</span>
                      {/* TODO: Connect edit promotion endpoint */}
                      <button className="text-xs font-bold text-admin-brand tracking-[0.24px] hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* TODO: Connect manage all discounts flow */}
              <button className="w-full mt-6 py-3 border border-admin-brand rounded-2xl text-sm font-bold text-admin-brand hover:bg-admin-brand/5 transition-colors">
                Manage All Discounts
              </button>
            </div>

            {/* Scheduled Queue */}
            <div className="bg-[#FAF8FF] border border-[#E5E7EB] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-admin-text-primary mb-6">Scheduled Queue</h2>
              <div className="flex flex-col gap-6">
                {scheduledPromotions.map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E7E7F2] rounded-2xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-admin-text-secondary uppercase">{s.month}</span>
                      <span className="text-base font-bold text-admin-text-primary -mt-0.5">{s.day}</span>
                    </div>
                    <div className={`flex-1 ${i < scheduledPromotions.length - 1 ? 'pb-4 border-b border-[#E5E7EB]' : ''}`}>
                      <p className="text-base font-bold text-admin-text-primary">{s.title}</p>
                      <p className="text-xs font-medium text-admin-text-secondary tracking-[0.24px] mt-0.5">{s.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Policy */}
            <div className="bg-admin-brand rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute w-40 h-40 rounded-full bg-white/10 blur-[32px] -right-10 -bottom-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-white" />
                  <h3 className="text-base font-bold text-white uppercase tracking-[0.8px]">Discount Policy</h3>
                </div>
                <p className="text-base text-white/90 leading-[26px]">
                  Stores can propose up to 2 regional flash sales per month. HQ approval is required for any discount exceeding 15%.
                </p>
                {/* TODO: Connect policy management workflow */}
                <button className="w-full mt-4 py-2 bg-white text-admin-brand rounded-lg text-base font-bold hover:bg-white/90 transition-colors">
                  Update Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 bg-white/80 backdrop-blur-md border-b border-admin-border/30">
          <h1 className="text-xl font-bold text-admin-text-primary">Promotions</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
          {/* Create Admin Offer */}
          {/* TODO: Open create promotion modal when backend flow is available */}
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#4F7CFF] text-white rounded-2xl text-sm font-bold shadow-md">
            <Plus className="w-4 h-4" />
            Create Admin Offer
          </button>

          {/* New Store Proposals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-bold text-admin-text-primary">New Store Proposals</h2>
              <span className="px-2 py-0.5 bg-admin-brand/10 rounded-full text-[10px] font-bold text-admin-brand uppercase">4 Pending</span>
            </div>
            <div className="flex flex-col gap-3">
              {proposals.map((p) => (
                <div key={p.id} className="bg-[#FAF8FF] border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-admin-profile rounded-lg flex items-center justify-center">
                        <Store className="w-4 h-3.5 text-admin-text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-admin-text-primary">{p.store}</p>
                        <p className="text-[10px] font-bold text-admin-text-secondary">{p.storeId}</p>
                      </div>
                    </div>
                    {p.isNew && <span className="px-2 py-0.5 bg-[#FFDDB8] rounded text-[10px] font-bold text-[#2A1700]">NEW</span>}
                  </div>
                  <p className="text-xs font-bold text-admin-brand">{p.promo}</p>
                  <p className="text-[11px] text-admin-text-secondary">{p.description}</p>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2 bg-admin-brand text-white rounded-lg text-xs font-bold">Approve</button>
                    <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-xs font-bold text-admin-text-primary">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Management */}
          <div className="bg-[#FAF8FF] border border-[#E5E7EB] rounded-2xl p-4">
            <h2 className="text-sm font-bold text-admin-text-primary mb-4">Active Management</h2>
            <div className="flex flex-col gap-3">
              {activePromotions.map((p, i) => (
                <div key={i} className="bg-admin-profile rounded-xl p-3">
                  <p className="text-[10px] font-bold text-admin-text-secondary uppercase">{p.label}</p>
                  <p className="text-sm font-bold text-admin-text-primary">{p.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs font-bold tracking-[0.24px] ${p.statusColor}`}>{p.status}</span>
                    <button className="text-xs font-bold text-admin-brand">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Queue */}
          <div className="bg-[#FAF8FF] border border-[#E5E7EB] rounded-2xl p-4">
            <h2 className="text-sm font-bold text-admin-text-primary mb-4">Scheduled Queue</h2>
            <div className="flex flex-col gap-4">
              {scheduledPromotions.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#E7E7F2] rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-admin-text-secondary uppercase">{s.month}</span>
                    <span className="text-sm font-bold text-admin-text-primary -mt-0.5">{s.day}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-admin-text-primary">{s.title}</p>
                    <p className="text-xs text-admin-text-secondary">{s.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promotion History */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-bold text-admin-text-primary">Promotion History</h2>
            </div>
            {campaigns.map((c, i) => (
              <div key={i} className="px-4 py-3 border-b border-[#E5E7EB] last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-admin-text-primary">{c.name}</p>
                    <p className="text-[11px] text-admin-text-secondary">{c.type}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-admin-text-secondary">
                      <span>{c.origin}</span>
                      <span>{c.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.statusBg}`}>{c.status}</span>
                    <button className="p-1">
                      <MoreVertical className="w-4 h-4 text-admin-text-secondary" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Discount Policy */}
          <div className="bg-admin-brand rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute w-40 h-40 rounded-full bg-white/10 blur-[32px] -right-10 -bottom-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.8px]">Discount Policy</h3>
              </div>
              <p className="text-sm text-white/90 leading-[24px]">
                Stores can propose up to 2 regional flash sales per month. HQ approval is required for any discount exceeding 15%.
              </p>
              <button className="w-full mt-3 py-2.5 bg-white text-admin-brand rounded-lg text-sm font-bold">
                Update Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
