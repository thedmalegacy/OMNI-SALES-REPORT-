import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ChannelUploader } from './components/ChannelUploader';
import { KpiCards } from './components/KpiCards';
import { ChannelComparisonChart } from './components/ChannelComparisonChart';
import { PnLWaterfall } from './components/PnLWaterfall';
import { SkuTable } from './components/SkuTable';
import { AiInsightsPanel } from './components/AiInsightsPanel';
import { INITIAL_SAMPLE_ORDERS } from './data/sampleData';
import { ChannelType, CurrencyType, OrderItem, ChannelSummary, SKUSummary, PnLStatement } from './types';

export default function App() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_SAMPLE_ORDERS);
  const [currency, setCurrency] = useState<CurrencyType>('INR');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const currencySymbol = currency === 'INR' ? '₹' : '$';
  // Standard conversion factor if user toggles currency view
  const conversionRate = currency === 'USD' ? 0.012 : 1;

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (dateFilter === 'all') return orders;

    const now = new Date('2026-07-28');
    const cutoffDays = dateFilter === 'last7' ? 7 : 30;
    const cutoffDate = new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000);

    return orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= cutoffDate;
    });
  }, [orders, dateFilter]);

  // Aggregated Channel Counts & Revenues
  const channelCounts = useMemo(() => {
    const counts: Record<ChannelType, number> = { amazon: 0, flipkart: 0, meesho: 0, website: 0 };
    filteredOrders.forEach(o => {
      counts[o.channel] = (counts[o.channel] || 0) + 1;
    });
    return counts;
  }, [filteredOrders]);

  const channelRevenues = useMemo(() => {
    const revs: Record<ChannelType, number> = { amazon: 0, flipkart: 0, meesho: 0, website: 0 };
    filteredOrders.forEach(o => {
      const net = o.status === 'returned' ? 0 : o.netAmount * conversionRate;
      revs[o.channel] = (revs[o.channel] || 0) + net;
    });
    return revs;
  }, [filteredOrders, conversionRate]);

  // Consolidated PnL Statement
  const pnlStatement: PnLStatement = useMemo(() => {
    let grossSales = 0;
    let discounts = 0;
    let returnsAndRefunds = 0;
    let totalCOGS = 0;
    let amazonFee = 0;
    let flipkartFee = 0;
    let meeshoFee = 0;
    let websiteFee = 0;
    let totalShipping = 0;

    filteredOrders.forEach(o => {
      const g = o.grossAmount * conversionRate;
      const d = o.discount * conversionRate;
      const fee = o.marketplaceFee * conversionRate;
      const ship = o.shippingFee * conversionRate;
      const c = o.cogs * conversionRate;
      const ref = o.refundAmount * conversionRate;

      grossSales += g;
      discounts += d;

      if (o.status === 'returned') {
        returnsAndRefunds += ref > 0 ? ref : (g - d);
      }

      totalCOGS += c;
      totalShipping += ship;

      if (o.channel === 'amazon') amazonFee += fee;
      else if (o.channel === 'flipkart') flipkartFee += fee;
      else if (o.channel === 'meesho') meeshoFee += fee;
      else if (o.channel === 'website') websiteFee += fee;
    });

    const grossRevenue = grossSales - discounts;
    const netRealizedRevenue = Math.max(0, grossRevenue - returnsAndRefunds);
    const grossProfit = netRealizedRevenue - totalCOGS;
    const totalMarketplaceFees = amazonFee + flipkartFee + meeshoFee + websiteFee;
    const netOperatingProfit = grossProfit - totalMarketplaceFees - totalShipping;
    const netMarginPercent = netRealizedRevenue > 0 ? (netOperatingProfit / netRealizedRevenue) * 100 : 0;

    return {
      grossSales: Math.round(grossSales),
      discounts: Math.round(discounts),
      grossRevenue: Math.round(grossRevenue),
      returnsAndRefunds: Math.round(returnsAndRefunds),
      netRealizedRevenue: Math.round(netRealizedRevenue),
      totalCOGS: Math.round(totalCOGS),
      grossProfit: Math.round(grossProfit),
      channelFees: {
        amazon: Math.round(amazonFee),
        flipkart: Math.round(flipkartFee),
        meesho: Math.round(meeshoFee),
        website: Math.round(websiteFee)
      },
      totalMarketplaceFees: Math.round(totalMarketplaceFees),
      totalShippingFees: Math.round(totalShipping),
      netOperatingProfit: Math.round(netOperatingProfit),
      netMarginPercent: Math.round(netMarginPercent * 10) / 10
    };
  }, [filteredOrders, conversionRate]);

  // Channel Summaries Array
  const channelSummaries: ChannelSummary[] = useMemo(() => {
    const channelsList: { id: ChannelType; label: string; color: string }[] = [
      { id: 'amazon', label: 'Amazon', color: '#f59e0b' },
      { id: 'flipkart', label: 'Flipkart', color: '#3b82f6' },
      { id: 'meesho', label: 'Meesho', color: '#ec4899' },
      { id: 'website', label: 'Brand Website', color: '#10b981' }
    ];

    return channelsList.map(ch => {
      const chOrders = filteredOrders.filter(o => o.channel === ch.id);
      let gross = 0;
      let net = 0;
      let fees = 0;
      let ship = 0;
      let cogs = 0;
      let refunds = 0;
      let totalUnits = 0;
      let returnCount = 0;

      chOrders.forEach(o => {
        const g = o.grossAmount * conversionRate;
        const d = o.discount * conversionRate;
        const fee = o.marketplaceFee * conversionRate;
        const sh = o.shippingFee * conversionRate;
        const cg = o.cogs * conversionRate;
        const ref = o.refundAmount * conversionRate;

        gross += g;
        fees += fee;
        ship += sh;
        cogs += cg;
        totalUnits += o.quantity;

        if (o.status === 'returned') {
          refunds += ref > 0 ? ref : (g - d);
          returnCount += 1;
        } else {
          net += (g - d);
        }
      });

      const netRev = Math.max(0, net);
      const profit = netRev - cogs - fees - ship;
      const margin = netRev > 0 ? (profit / netRev) * 100 : 0;
      const returnRate = chOrders.length > 0 ? (returnCount / chOrders.length) * 100 : 0;

      return {
        channel: ch.id,
        label: ch.label,
        color: ch.color,
        totalOrders: chOrders.length,
        totalUnits,
        totalGrossRevenue: Math.round(gross),
        totalNetRevenue: Math.round(netRev),
        totalMarketplaceFees: Math.round(fees),
        totalShippingFees: Math.round(ship),
        totalCOGS: Math.round(cogs),
        totalRefunds: Math.round(refunds),
        netProfit: Math.round(profit),
        profitMarginPercent: Math.round(margin * 10) / 10,
        returnRatePercent: Math.round(returnRate * 10) / 10
      };
    });
  }, [filteredOrders, conversionRate]);

  // SKU Performance Summaries
  const skuSummaries: SKUSummary[] = useMemo(() => {
    const skuMap: Record<string, {
      productName: string;
      units: number;
      grossSales: number;
      netSales: number;
      fees: number;
      cogsPerUnit: number;
      totalCOGS: number;
      refunds: number;
      returnCount: number;
      totalOrders: number;
      channels: Set<ChannelType>;
    }> = {};

    filteredOrders.forEach(o => {
      const sku = o.sku.toUpperCase();
      if (!skuMap[sku]) {
        skuMap[sku] = {
          productName: o.productName,
          units: 0,
          grossSales: 0,
          netSales: 0,
          fees: 0,
          cogsPerUnit: o.quantity > 0 ? (o.cogs / o.quantity) * conversionRate : 0,
          totalCOGS: 0,
          refunds: 0,
          returnCount: 0,
          totalOrders: 0,
          channels: new Set<ChannelType>()
        };
      }

      const item = skuMap[sku];
      item.channels.add(o.channel);
      item.totalOrders += 1;
      item.units += o.quantity;

      const g = o.grossAmount * conversionRate;
      const d = o.discount * conversionRate;
      const f = (o.marketplaceFee + o.shippingFee) * conversionRate;
      const cg = o.cogs * conversionRate;
      const ref = o.refundAmount * conversionRate;

      item.grossSales += g;
      item.fees += f;
      item.totalCOGS += cg;

      if (o.status === 'returned') {
        item.refunds += ref > 0 ? ref : (g - d);
        item.returnCount += 1;
      } else {
        item.netSales += (g - d);
      }
    });

    return Object.keys(skuMap).map(skuKey => {
      const item = skuMap[skuKey];
      const netSales = Math.max(0, item.netSales);
      const netProfit = netSales - item.totalCOGS - item.fees;
      const margin = netSales > 0 ? (netProfit / netSales) * 100 : 0;
      const returnRate = item.totalOrders > 0 ? (item.returnCount / item.totalOrders) * 100 : 0;

      return {
        sku: skuKey,
        productName: item.productName,
        totalUnitsSold: item.units,
        grossSales: Math.round(item.grossSales),
        netSales: Math.round(netSales),
        totalFees: Math.round(item.fees),
        cogsPerUnit: Math.round(item.cogsPerUnit * 100) / 100,
        totalCOGS: Math.round(item.totalCOGS),
        refunds: Math.round(item.refunds),
        netProfit: Math.round(netProfit),
        profitMarginPercent: Math.round(margin * 10) / 10,
        returnCount: item.returnCount,
        returnRatePercent: Math.round(returnRate * 10) / 10,
        channels: Array.from(item.channels)
      };
    });
  }, [filteredOrders, conversionRate]);

  // Handlers
  const handleAddOrders = (newOrders: OrderItem[]) => {
    setOrders(prev => [...newOrders, ...prev]);
  };

  const handleLoadSampleData = () => {
    setOrders(INITIAL_SAMPLE_ORDERS);
  };

  const handleClearData = () => {
    setOrders([]);
  };

  const handleUpdateCogs = (targetSku: string, newCogsPerUnit: number) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.sku.toUpperCase() === targetSku.toUpperCase()) {
          const rawCogs = (newCogsPerUnit / conversionRate) * o.quantity;
          let newProfit = 0;
          if (o.status === 'returned') {
            newProfit = -(o.marketplaceFee + o.shippingFee + (rawCogs * 0.2));
          } else {
            newProfit = o.netAmount - o.marketplaceFee - o.shippingFee - rawCogs;
          }
          const newMargin = o.netAmount > 0 ? (newProfit / o.netAmount) * 100 : 0;

          return {
            ...o,
            cogs: Math.round(rawCogs),
            calculatedNetProfit: Math.round(newProfit * 100) / 100,
            calculatedMarginPercent: Math.round(newMargin * 100) / 100
          };
        }
        return o;
      })
    );
  };

  const handleExportCsv = () => {
    let csvContent = 'Order ID,Date,Channel,SKU,Product Name,Qty,Gross Sales,Discount,Net Sales,Channel Fee,Shipping Fee,COGS,Status,Net Profit,Margin %\n';

    filteredOrders.forEach(o => {
      const g = (o.grossAmount * conversionRate).toFixed(2);
      const d = (o.discount * conversionRate).toFixed(2);
      const net = (o.netAmount * conversionRate).toFixed(2);
      const fee = (o.marketplaceFee * conversionRate).toFixed(2);
      const ship = (o.shippingFee * conversionRate).toFixed(2);
      const cg = (o.cogs * conversionRate).toFixed(2);
      const profit = (o.calculatedNetProfit * conversionRate).toFixed(2);

      csvContent += `"${o.orderId}","${o.date}","${o.channel}","${o.sku}","${o.productName.replace(/"/g, '""')}",${o.quantity},${g},${d},${net},${fee},${ship},${cg},"${o.status}",${profit},${o.calculatedMarginPercent}%\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `omnichannel_pnl_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalUnits = useMemo(() => {
    return filteredOrders.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredOrders]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      {/* Top Header Navigation */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onLoadSampleData={handleLoadSampleData}
        onClearData={handleClearData}
        onExportCsv={handleExportCsv}
        totalOrdersCount={filteredOrders.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Section 1: Multi-Channel Report Uploader */}
        <ChannelUploader
          onOrdersAdded={handleAddOrders}
          channelCounts={channelCounts}
          channelRevenues={channelRevenues}
          currencySymbol={currencySymbol}
        />

        {/* Section 2: Top KPI Metric Cards */}
        <KpiCards
          pnl={pnlStatement}
          currencySymbol={currencySymbol}
          totalOrders={filteredOrders.length}
          totalUnits={totalUnits}
        />

        {/* Section 3: Recharts Financial Comparison */}
        <ChannelComparisonChart
          channelSummaries={channelSummaries}
          currencySymbol={currencySymbol}
        />

        {/* Section 4: Gemini AI Diagnostic Audit */}
        <AiInsightsPanel
          pnl={pnlStatement}
          channelSummaries={channelSummaries}
          currencySymbol={currencySymbol}
        />

        {/* Section 5: P&L Statement Waterfall */}
        <PnLWaterfall
          pnl={pnlStatement}
          currencySymbol={currencySymbol}
        />

        {/* Section 6: SKU-Level Unit Economics & Editable COGS */}
        <SkuTable
          skuSummaries={skuSummaries}
          currencySymbol={currencySymbol}
          onUpdateCogs={handleUpdateCogs}
        />
      </main>
    </div>
  );
}
