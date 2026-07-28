import React from 'react';
import { FileText, ArrowDownRight, ArrowUpRight, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PnLStatement } from '../types';

interface PnLWaterfallProps {
  pnl: PnLStatement;
  currencySymbol: string;
}

export const PnLWaterfall: React.FC<PnLWaterfallProps> = ({ pnl, currencySymbol }) => {
  const isProfitable = pnl.netOperatingProfit >= 0;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Consolidated P&L Financial Statement</h3>
            <p className="text-xs text-slate-500 font-medium">Waterfall view from Gross Sales down to Net Take-Home Operating Profit</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
            isProfitable
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {isProfitable ? 'NET PROFITABLE' : 'NET OPERATING LOSS'}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5 text-xs font-mono">
        {/* 1. Gross Sales */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-700 font-sans font-semibold">1. Gross Product Sales</span>
          <span className="text-slate-900 font-black text-sm">{currencySymbol}{pnl.grossSales.toLocaleString()}</span>
        </div>

        {/* 2. Discounts */}
        {pnl.discounts > 0 && (
          <div className="flex items-center justify-between p-2.5 pl-6 bg-slate-50/50 rounded-lg text-slate-600">
            <span className="font-sans font-medium">(-) Seller Discounts & Coupons</span>
            <span className="text-rose-600 font-bold">-{currencySymbol}{pnl.discounts.toLocaleString()}</span>
          </div>
        )}

        {/* 3. Customer Returns */}
        <div className="flex items-center justify-between p-2.5 pl-6 bg-slate-50/50 rounded-lg text-slate-600">
          <span className="font-sans font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            (-) Customer Returns & Order Refunds
          </span>
          <span className="text-rose-600 font-bold">-{currencySymbol}{pnl.returnsAndRefunds.toLocaleString()}</span>
        </div>

        {/* Subtotal: Net Realized Revenue */}
        <div className="flex items-center justify-between p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-800">
          <span className="text-slate-800 font-sans font-bold">(=) Net Realized Revenue</span>
          <span className="text-emerald-600 font-black text-sm">{currencySymbol}{pnl.netRealizedRevenue.toLocaleString()}</span>
        </div>

        {/* 4. COGS */}
        <div className="flex items-center justify-between p-2.5 pl-6 bg-slate-50/50 rounded-lg text-slate-600">
          <span className="font-sans font-medium">(-) Cost of Goods Sold (Manufacturing / Purchase)</span>
          <span className="text-rose-600 font-bold">-{currencySymbol}{pnl.totalCOGS.toLocaleString()}</span>
        </div>

        {/* Subtotal: Gross Profit */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-800 font-sans font-bold">(=) Gross Profit (Before Platform Fees)</span>
          <span className="text-slate-900 font-black">{currencySymbol}{pnl.grossProfit.toLocaleString()}</span>
        </div>

        {/* 5. Marketplace Commission breakdown */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-slate-700 font-sans font-semibold mb-1">
            <span>(-) Marketplace Commissions & Platform Fees</span>
            <span className="text-rose-600 font-black">-{currencySymbol}{pnl.totalMarketplaceFees.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-2 border-t border-slate-200">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-indigo-600 block font-sans font-bold text-[11px]">Amazon Fee</span>
              <span className="text-slate-800 font-bold">{currencySymbol}{pnl.channelFees.amazon.toLocaleString()}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-sky-600 block font-sans font-bold text-[11px]">Flipkart Fee</span>
              <span className="text-slate-800 font-bold">{currencySymbol}{pnl.channelFees.flipkart.toLocaleString()}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-purple-600 block font-sans font-bold text-[11px]">Meesho Fee</span>
              <span className="text-slate-800 font-bold">{currencySymbol}{pnl.channelFees.meesho.toLocaleString()}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-emerald-600 block font-sans font-bold text-[11px]">Website Gateway</span>
              <span className="text-slate-800 font-bold">{currencySymbol}{pnl.channelFees.website.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 6. Shipping & Logistics */}
        <div className="flex items-center justify-between p-2.5 pl-6 bg-slate-50/50 rounded-lg text-slate-600">
          <span className="font-sans font-medium">(-) Courier, EasyShip & Logistics Charges</span>
          <span className="text-rose-600 font-bold">-{currencySymbol}{pnl.totalShippingFees.toLocaleString()}</span>
        </div>

        {/* FINAL BOTTOM LINE: NET OPERATING PROFIT */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border ${
          isProfitable
            ? 'bg-slate-900 border-slate-800 text-white shadow-lg'
            : 'bg-rose-50 border-rose-200 text-rose-900 shadow-sm'
        }`}>
          <div>
            <div className="text-xs uppercase font-sans font-black tracking-wider text-slate-300">
              Final Net Operating Profit
            </div>
            <div className="text-xs font-sans text-slate-400 mt-1 font-medium">
              Net Profit Margin Ratio: <span className="font-bold font-mono text-emerald-400">{pnl.netMarginPercent.toFixed(1)}%</span>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-2xl font-black font-mono ${isProfitable ? 'text-emerald-400' : 'text-rose-600'}`}>
              {isProfitable ? '+' : ''}{currencySymbol}{pnl.netOperatingProfit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
