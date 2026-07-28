import React, { useState } from 'react';
import { Sparkles, Brain, AlertTriangle, Lightbulb, CheckCircle2, RefreshCcw, ArrowRight } from 'lucide-react';
import { AIAnalysisResult, ChannelSummary, PnLStatement } from '../types';

interface AiInsightsPanelProps {
  pnl: PnLStatement;
  channelSummaries: ChannelSummary[];
  currencySymbol: string;
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({
  pnl,
  channelSummaries,
  currencySymbol
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<AIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateAiAudit = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        currency: currencySymbol === '₹' ? 'INR' : 'USD',
        summaryData: {
          grossSales: `${currencySymbol}${pnl.grossSales}`,
          netRealizedRevenue: `${currencySymbol}${pnl.netRealizedRevenue}`,
          totalCOGS: `${currencySymbol}${pnl.totalCOGS}`,
          totalMarketplaceFees: `${currencySymbol}${pnl.totalMarketplaceFees}`,
          totalShippingFees: `${currencySymbol}${pnl.totalShippingFees}`,
          netOperatingProfit: `${currencySymbol}${pnl.netOperatingProfit}`,
          netMarginPercent: pnl.netMarginPercent
        },
        channelBreakdown: channelSummaries.map(s => ({
          channel: s.label,
          netSales: `${currencySymbol}${s.totalNetRevenue}`,
          netProfit: `${currencySymbol}${s.netProfit}`,
          margin: `${s.profitMarginPercent.toFixed(1)}%`,
          returnRate: `${s.returnRatePercent.toFixed(1)}%`
        }))
      };

      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setInsights(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to retrieve AI analysis.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error generating AI audit.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-100/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              Gemini AI Financial & Margin Auditor
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Automated multi-channel P&L diagnostic, fee leakage detection & margin optimization tips
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateAiAudit}
          disabled={isLoading}
          className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Sales Data...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>{insights ? 'Re-run AI Audit' : 'Generate Strategic AI Audit'}</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="mt-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      {insights && !isLoading && (
        <div className="mt-5 space-y-4">
          {/* Executive Summary */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Executive Audit Summary
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {insights.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Channel Winner */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Channel Efficiency Evaluation
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {insights.topChannelInsight}
              </p>
            </div>

            {/* Fee Leakages & Returns */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Fee Leakages & Risk Warnings
              </h4>
              <ul className="text-xs text-slate-700 space-y-1 mt-1 list-disc list-inside font-medium">
                {insights.unprofitableSkuAlerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2.5 flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4" />
              Recommended Margin Growth Action Items
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {insights.growthActionPlan.map((action, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-700 flex items-start gap-2 font-medium">
                  <span className="bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">
                    #{idx + 1}
                  </span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!insights && !isLoading && (
        <div className="mt-4 p-8 text-center bg-white/80 rounded-xl border border-slate-100">
          <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-pulse" />
          <p className="text-xs text-slate-500 font-medium">
            Click <span className="text-indigo-600 font-bold">"Generate Strategic AI Audit"</span> above to trigger a Gemini AI financial diagnostic on your multi-channel sales.
          </p>
        </div>
      )}
    </div>
  );
};
