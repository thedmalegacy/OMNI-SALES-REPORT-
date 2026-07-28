import React, { useState } from 'react';
import { Search, Filter, Edit3, Check, ArrowUpDown, ShieldAlert, ShoppingBag } from 'lucide-react';
import { ChannelType, SKUSummary } from '../types';

interface SkuTableProps {
  skuSummaries: SKUSummary[];
  currencySymbol: string;
  onUpdateCogs: (sku: string, newCogsPerUnit: number) => void;
}

export const SkuTable: React.FC<SkuTableProps> = ({
  skuSummaries,
  currencySymbol,
  onUpdateCogs
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedProfitFilter, setSelectedProfitFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof SKUSummary>('netProfit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editingCogsValue, setEditingCogsValue] = useState<string>('');

  const handleStartEdit = (skuSummary: SKUSummary) => {
    setEditingSku(skuSummary.sku);
    setEditingCogsValue(skuSummary.cogsPerUnit.toString());
  };

  const handleSaveEdit = (sku: string) => {
    const parsed = parseFloat(editingCogsValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateCogs(sku, parsed);
    }
    setEditingSku(null);
  };

  const handleSort = (field: keyof SKUSummary) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter logic
  const filteredSkus = skuSummaries.filter(item => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel =
      selectedChannel === 'all' || item.channels.includes(selectedChannel as ChannelType);

    let matchesProfit = true;
    if (selectedProfitFilter === 'high') matchesProfit = item.profitMarginPercent >= 40;
    else if (selectedProfitFilter === 'low') matchesProfit = item.profitMarginPercent > 0 && item.profitMarginPercent < 20;
    else if (selectedProfitFilter === 'loss') matchesProfit = item.profitMarginPercent <= 0;
    else if (selectedProfitFilter === 'high_return') matchesProfit = item.returnRatePercent >= 15;

    return matchesSearch && matchesChannel && matchesProfit;
  });

  // Sorting
  const sortedSkus = [...filteredSkus].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortDirection === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }

    return sortDirection === 'asc'
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            SKU Profitability & Unit Economics Matrix
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Click edit on COGS/unit to adjust manufacturing costs and recalculate net profit across all sales.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search SKU or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-slate-800 text-xs rounded-xl pl-8 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-500 w-48 shadow-2xs font-medium"
            />
          </div>

          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-white text-slate-700 text-xs rounded-xl px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs font-semibold"
          >
            <option value="all">All Channels</option>
            <option value="amazon">Amazon</option>
            <option value="flipkart">Flipkart</option>
            <option value="meesho">Meesho</option>
            <option value="website">Brand Website</option>
          </select>

          {/* Profit Filter */}
          <select
            value={selectedProfitFilter}
            onChange={(e) => setSelectedProfitFilter(e.target.value)}
            className="bg-white text-slate-700 text-xs rounded-xl px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs font-semibold"
          >
            <option value="all">All Profit States</option>
            <option value="high">High Margin (≥ 40%)</option>
            <option value="low">Low Margin (&lt; 20%)</option>
            <option value="loss">Loss Making (≤ 0%)</option>
            <option value="high_return">High Returns (≥ 15%)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider bg-slate-50">
              <th className="p-3.5">Product / SKU</th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('totalUnitsSold')}>
                <div className="flex items-center gap-1">
                  <span>Units</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('netSales')}>
                <div className="flex items-center gap-1">
                  <span>Net Sales</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Total Fees</th>
              <th className="p-3.5">COGS / Unit (Edit)</th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('netProfit')}>
                <div className="flex items-center gap-1">
                  <span>Net Profit</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('profitMarginPercent')}>
                <div className="flex items-center gap-1">
                  <span>Margin %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => handleSort('returnRatePercent')}>
                <div className="flex items-center gap-1">
                  <span>Returns %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedSkus.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                  No matching SKU data found.
                </td>
              </tr>
            ) : (
              sortedSkus.map((skuItem) => {
                const isLoss = skuItem.netProfit <= 0;
                const isHighReturn = skuItem.returnRatePercent >= 15;

                return (
                  <tr key={skuItem.sku} className="hover:bg-slate-50/80 transition-colors">
                    {/* Product / SKU */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800 font-mono">{skuItem.sku}</div>
                      <div className="text-xs text-slate-500 font-medium line-clamp-1 max-w-xs">{skuItem.productName}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {skuItem.channels.map(ch => (
                          <span
                            key={ch}
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                              ch === 'amazon' ? 'bg-amber-100 text-amber-800' :
                              ch === 'flipkart' ? 'bg-sky-100 text-sky-800' :
                              ch === 'meesho' ? 'bg-purple-100 text-purple-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Units */}
                    <td className="p-3.5 font-mono text-slate-800 font-bold">
                      {skuItem.totalUnitsSold}
                    </td>

                    {/* Net Sales */}
                    <td className="p-3.5 font-mono text-slate-800 font-bold">
                      {currencySymbol}{skuItem.netSales.toLocaleString()}
                    </td>

                    {/* Fees */}
                    <td className="p-3.5 font-mono text-rose-600 font-medium">
                      -{currencySymbol}{skuItem.totalFees.toLocaleString()}
                    </td>

                    {/* COGS Editable */}
                    <td className="p-3.5 font-mono">
                      {editingSku === skuItem.sku ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-500 text-xs">{currencySymbol}</span>
                          <input
                            type="number"
                            value={editingCogsValue}
                            onChange={(e) => setEditingCogsValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(skuItem.sku);
                            }}
                            className="bg-white text-indigo-700 border border-indigo-500 px-2 py-0.5 rounded text-xs w-20 font-bold focus:outline-none shadow-2xs"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(skuItem.sku)}
                            className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(skuItem)}
                          className="flex items-center space-x-1 hover:bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium transition-colors cursor-pointer group"
                          title="Click to edit unit manufacturing cost"
                        >
                          <span>{currencySymbol}{skuItem.cogsPerUnit}</span>
                          <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 ml-1" />
                        </button>
                      )}
                    </td>

                    {/* Net Profit */}
                    <td className={`p-3.5 font-mono font-bold ${isLoss ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isLoss ? '' : '+'}{currencySymbol}{skuItem.netProfit.toLocaleString()}
                    </td>

                    {/* Margin % */}
                    <td className="p-3.5 font-mono">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        skuItem.profitMarginPercent >= 40 ? 'bg-emerald-100 text-emerald-800' :
                        skuItem.profitMarginPercent >= 20 ? 'bg-amber-100 text-amber-800' :
                        skuItem.profitMarginPercent >= 0 ? 'bg-slate-100 text-slate-700' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {skuItem.profitMarginPercent.toFixed(1)}%
                      </span>
                    </td>

                    {/* Return Rate % */}
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-1">
                        <span className={`font-bold ${isHighReturn ? 'text-rose-600' : 'text-slate-700'}`}>
                          {skuItem.returnRatePercent.toFixed(1)}%
                        </span>
                        {isHighReturn && (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" title="High Return Alert" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
