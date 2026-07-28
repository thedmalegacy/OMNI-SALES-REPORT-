export type ChannelType = 'amazon' | 'flipkart' | 'meesho' | 'website';

export type CurrencyType = 'INR' | 'USD';

export interface OrderItem {
  id: string;
  orderId: string;
  date: string;
  channel: ChannelType;
  sku: string;
  productName: string;
  quantity: number;
  grossAmount: number;
  discount: number;
  netAmount: number;
  marketplaceFee: number;
  shippingFee: number;
  cogs: number;
  status: 'delivered' | 'returned' | 'cancelled' | 'pending';
  refundAmount: number;
  taxAmount: number;
  calculatedNetProfit: number;
  calculatedMarginPercent: number;
}

export interface ChannelSummary {
  channel: ChannelType;
  label: string;
  color: string;
  totalOrders: number;
  totalUnits: number;
  totalGrossRevenue: number;
  totalNetRevenue: number;
  totalMarketplaceFees: number;
  totalShippingFees: number;
  totalCOGS: number;
  totalRefunds: number;
  netProfit: number;
  profitMarginPercent: number;
  returnRatePercent: number;
}

export interface SKUSummary {
  sku: string;
  productName: string;
  totalUnitsSold: number;
  grossSales: number;
  netSales: number;
  totalFees: number;
  cogsPerUnit: number;
  totalCOGS: number;
  refunds: number;
  netProfit: number;
  profitMarginPercent: number;
  returnCount: number;
  returnRatePercent: number;
  channels: ChannelType[];
}

export interface PnLStatement {
  grossSales: number;
  discounts: number;
  grossRevenue: number;
  returnsAndRefunds: number;
  netRealizedRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  channelFees: {
    amazon: number;
    flipkart: number;
    meesho: number;
    website: number;
  };
  totalMarketplaceFees: number;
  totalShippingFees: number;
  netOperatingProfit: number;
  netMarginPercent: number;
}

export interface AIAnalysisResult {
  executiveSummary: string;
  topChannelInsight: string;
  unprofitableSkuAlerts: string[];
  feeOptimizationTips: string[];
  growthActionPlan: string[];
}
