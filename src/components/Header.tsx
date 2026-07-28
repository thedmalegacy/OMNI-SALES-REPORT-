import React from 'react';
import { ShoppingBag, RefreshCw, Download, Trash2, Calendar, DollarSign, Layers } from 'lucide-react';
import { CurrencyType } from '../types';

interface HeaderProps {
  currency: CurrencyType;
  onCurrencyChange: (c: CurrencyType) => void;
  dateFilter: string;
  onDateFilterChange: (d: string) => void;
  onLoadSampleData: () => void;
  onClearData: () => void;
  onExportCsv: () => void;
  totalOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  dateFilter,
  onDateFilterChange,
  onLoadSampleData,
  onClearData,
  onExportCsv,
  totalOrdersCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-indigo-200">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-slate-800">OmniChannel Sales & Profit Hub</h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {totalOrdersCount} Active Orders
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Centralized Profit, Loss & Fee Audit for Amazon • Flipkart • Meesho • Brand Website
            </p>
          </div>
        </div>

        {/* Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => onCurrencyChange('INR')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Date Filter */}
          <div className="relative flex items-center bg-white rounded-xl px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="bg-transparent text-slate-700 focus:outline-none cursor-pointer pr-1 font-semibold"
            >
              <option value="all">All Time</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
            </select>
          </div>

          {/* Load Sample Data */}
          <button
            onClick={onLoadSampleData}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            title="Reload Sample Multi-Channel Orders"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sample Data</span>
          </button>

          {/* Export Master CSV */}
          <button
            onClick={onExportCsv}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 cursor-pointer"
            title="Download Consolidated Profit & Loss CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Clear All */}
          <button
            onClick={onClearData}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-medium transition-all cursor-pointer"
            title="Clear all loaded reports"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
