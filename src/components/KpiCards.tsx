import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Package, ShieldCheck, Percent, Truck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PnLStatement } from '../types';

interface KpiCardsProps {
  pnl: PnLStatement;
  currencySymbol: string;
  totalOrders: number;
  totalUnits: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  pnl,
  currencySymbol,
  totalOrders,
  totalUnits
}) => {
  const isProfitable = pnl.netOperatingProfit >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {/* 1. Gross Revenue */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Sales</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            {currencySymbol}{pnl.grossSales.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1.5 flex items-center justify-between font-medium">
            <span>{totalOrders} Orders</span>
            <span className="font-mono text-slate-700">{totalUnits} Units</span>
          </div>
        </div>
      </div>

      {/* 2. Net Realized Revenue */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Sales</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {currencySymbol}{pnl.netRealizedRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-rose-500 mt-1.5 flex items-center justify-between font-medium">
            <span>Returns & Refunds:</span>
            <span className="font-mono font-bold">-{currencySymbol}{pnl.returnsAndRefunds.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3. Cost of Goods Sold (COGS) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total COGS</span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            {currencySymbol}{pnl.totalCOGS.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1.5 font-medium">
            Product manufacturing cost
          </div>
        </div>
      </div>

      {/* 4. Total Fees & Logistics */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fees & Logistics</span>
          <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-violet-600 font-mono">
            {currencySymbol}{(pnl.totalMarketplaceFees + pnl.totalShippingFees).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1.5 flex items-center justify-between font-medium">
            <span>Commission + Ship:</span>
            <span className="font-mono font-bold text-slate-700">
              {pnl.netRealizedRevenue > 0
                ? `${Math.round(((pnl.totalMarketplaceFees + pnl.totalShippingFees) / pnl.netRealizedRevenue) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Net Operating Profit */}
      <div className={`bg-white border ${isProfitable ? 'border-emerald-200' : 'border-rose-200'} rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all`}>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Profit / Loss</span>
          <div className={`p-2 rounded-xl ${isProfitable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isProfitable ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          </div>
        </div>
        <div>
          <div className={`text-2xl font-black font-mono ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isProfitable ? '+' : ''}{currencySymbol}{pnl.netOperatingProfit.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1.5 font-medium">
            Bottom-line take home
          </div>
        </div>
      </div>

      {/* 6. Net Margin % (Hero Indigo Card in Sleek Interface) */}
      <div className="bg-indigo-600 text-white rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
        <div className="flex items-center justify-between text-indigo-200 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Average Margin</span>
          <div className="p-2 bg-indigo-500/30 text-white rounded-xl">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black font-mono text-white">
            {pnl.netMarginPercent.toFixed(1)}%
          </div>
          <div className="w-full bg-indigo-400/30 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, pnl.netMarginPercent))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
