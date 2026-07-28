import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ChannelSummary } from '../types';

interface ChannelComparisonChartProps {
  channelSummaries: ChannelSummary[];
  currencySymbol: string;
}

const CHANNEL_COLORS: Record<string, string> = {
  amazon: '#6366f1',  // Indigo
  flipkart: '#38bdf8', // Sky
  meesho: '#a855f7',   // Purple/Violet
  website: '#10b981'   // Emerald
};

export const ChannelComparisonChart: React.FC<ChannelComparisonChartProps> = ({
  channelSummaries,
  currencySymbol
}) => {
  const chartData = channelSummaries.map(s => ({
    name: s.label,
    channelKey: s.channel,
    grossRevenue: s.totalGrossRevenue,
    netRevenue: s.totalNetRevenue,
    netProfit: s.netProfit,
    feesAndShip: s.totalMarketplaceFees + s.totalShippingFees,
    cogs: s.totalCOGS,
    returnRate: s.returnRatePercent,
    margin: s.profitMarginPercent
  }));

  const pieData = channelSummaries
    .filter(s => s.totalNetRevenue > 0)
    .map(s => ({
      name: s.label,
      value: s.totalNetRevenue,
      color: CHANNEL_COLORS[s.channel] || '#6366f1'
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Multi-Channel Net Revenue vs Net Profit */}
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Channel Financial Comparison</h3>
            <p className="text-xs text-slate-500 font-medium">Net Revenue, Net Profit, and Channel Deductions side-by-side</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${currencySymbol}${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${currencySymbol}${Number(value).toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="netRevenue" name="Net Revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="feesAndShip" name="Fees & Logistics" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Revenue Share Pie Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Revenue Share by Channel</h3>
          <p className="text-xs text-slate-500 font-medium">Distribution of Net Sales across Marketplaces</p>
        </div>

        <div className="h-56 w-full mt-2">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${currencySymbol}${Number(value).toLocaleString()}`, 'Net Sales']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
              No revenue data loaded
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          {channelSummaries.map(s => (
            <div key={s.channel} className="flex items-center space-x-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHANNEL_COLORS[s.channel] }} />
              <span className="text-slate-700 font-bold truncate">{s.label}:</span>
              <span className="text-slate-500 font-mono text-[11px] ml-auto font-medium">
                {s.profitMarginPercent.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
