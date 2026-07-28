import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ChannelType, OrderItem } from '../types';

// Default COGS mapping if not provided in file (users can also edit in UI)
const DEFAULT_COGS_ESTIMATES: Record<string, number> = {
  'TSHIRT-BLK-M': 180,
  'HOODIE-GRY-L': 650,
  'JEANS-SLIM-32': 820,
  'CAP-NAVY-OS': 150,
  'JCKT-BOMBER-L': 1100,
  'SOCKS-3PK-WHT': 80
};

// Helper to sanitize numeric values
function parseNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const str = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

// Find header value matching candidates
function getFieldValue(row: Record<string, any>, candidates: string[]): any {
  const rowKeys = Object.keys(row);
  for (const candidate of candidates) {
    const key = rowKeys.find(k => k.toLowerCase().trim() === candidate.toLowerCase());
    if (key && row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return row[key];
    }
  }
  // Try partial includes
  for (const candidate of candidates) {
    const key = rowKeys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(candidate.toLowerCase().replace(/[^a-z0-9]/g, '')));
    if (key && row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return row[key];
    }
  }
  return null;
}

export function parseReportRow(row: Record<string, any>, channel: ChannelType, index: number): OrderItem | null {
  const orderId = getFieldValue(row, ['order id', 'sub order id', 'order_id', 'order no', 'name', 'transaction id']) || `ORD-${Date.now()}-${index}`;
  const sku = getFieldValue(row, ['sku', 'lineitem sku', 'fsku', 'sku id', 'product code', 'item_sku']) || 'GENERIC-SKU';
  const productName = getFieldValue(row, ['product title', 'product name', 'title', 'lineitem name', 'description', 'item title']) || sku;
  const dateStr = getFieldValue(row, ['order date', 'date', 'created at', 'transaction date', 'date/time']) || new Date().toISOString().split('T')[0];
  const quantity = Math.max(1, parseNumber(getFieldValue(row, ['quantity', 'qty', 'lineitem quantity', 'units', 'item count'])));

  let grossAmount = parseNumber(getFieldValue(row, ['item price', 'selling price', 'supplier discounted price', 'lineitem price', 'total', 'amount', 'gross amount', 'price']));
  if (grossAmount === 0 && row.Total) grossAmount = parseNumber(row.Total);

  const discount = parseNumber(getFieldValue(row, ['discount', 'seller discount', 'coupon']));
  const netAmount = grossAmount > discount ? grossAmount - discount : grossAmount;

  let marketplaceFee = parseNumber(getFieldValue(row, ['commission', 'marketplace fee', 'commission taxable amount', 'platform fee', 'referral fee']));
  // Estimated default marketplace commission if 0 (except Meesho which is 0%)
  if (marketplaceFee === 0 && channel === 'amazon') {
    marketplaceFee = netAmount * 0.15;
  } else if (marketplaceFee === 0 && channel === 'flipkart') {
    marketplaceFee = netAmount * 0.14;
  } else if (marketplaceFee === 0 && channel === 'website') {
    marketplaceFee = netAmount * 0.02; // 2% gateway fee
  }

  let shippingFee = parseNumber(getFieldValue(row, ['shipping fee', 'shipping charge', 'shipping', 'fulfillment fee', 'delivery fee']));
  if (shippingFee === 0) {
    shippingFee = channel === 'meesho' ? 80 * quantity : channel === 'flipkart' ? 70 * quantity : 60 * quantity;
  }

  const rawStatus = String(getFieldValue(row, ['order status', 'financial status', 'status', 'return type', 'item status']) || 'delivered').toLowerCase();
  let status: 'delivered' | 'returned' | 'cancelled' | 'pending' = 'delivered';
  if (rawStatus.includes('return') || rawStatus.includes('rto') || rawStatus.includes('refund')) {
    status = 'returned';
  } else if (rawStatus.includes('cancel')) {
    status = 'cancelled';
  } else if (rawStatus.includes('pending') || rawStatus.includes('unpaid')) {
    status = 'pending';
  }

  let refundAmount = parseNumber(getFieldValue(row, ['refund amount', 'refunded amount', 'refund', 'return refund']));
  if (status === 'returned' && refundAmount === 0) {
    refundAmount = netAmount;
  }

  const taxAmount = parseNumber(getFieldValue(row, ['tax', 'gst', 'tax amount', 'vat'])) || Math.round(netAmount * 0.05);

  // Estimate COGS
  let cogs = DEFAULT_COGS_ESTIMATES[sku.toUpperCase()] ? DEFAULT_COGS_ESTIMATES[sku.toUpperCase()] * quantity : Math.round(netAmount * 0.35);

  // Profit Calculation:
  // If delivered: Net Sales - Fees - Shipping - COGS
  // If returned: -Refund + Net Sales (0) - Fees (retained) - Reverse Shipping - COGS (restocked or damaged)
  let calculatedNetProfit = 0;
  if (status === 'returned') {
    calculatedNetProfit = -(marketplaceFee + shippingFee + (cogs * 0.2)); // 20% loss on damaged returned stock
  } else {
    calculatedNetProfit = netAmount - marketplaceFee - shippingFee - cogs;
  }

  const calculatedMarginPercent = netAmount > 0 ? (calculatedNetProfit / netAmount) * 100 : 0;

  return {
    id: `${channel}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
    orderId,
    date: dateStr.split('T')[0],
    channel,
    sku,
    productName,
    quantity,
    grossAmount,
    discount,
    netAmount,
    marketplaceFee,
    shippingFee,
    cogs,
    status,
    refundAmount,
    taxAmount,
    calculatedNetProfit: Math.round(calculatedNetProfit * 100) / 100,
    calculatedMarginPercent: Math.round(calculatedMarginPercent * 100) / 100
  };
}

export async function parseUploadedFile(file: File, channel: ChannelType): Promise<OrderItem[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'xlsx' || extension === 'xls') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

          const items: OrderItem[] = [];
          jsonData.forEach((row, idx) => {
            const parsed = parseReportRow(row, channel, idx);
            if (parsed) items.push(parsed);
          });
          resolve(items);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  // Handle CSV/TSV
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const items: OrderItem[] = [];
        (results.data as Record<string, any>[]).forEach((row, idx) => {
          const parsed = parseReportRow(row, channel, idx);
          if (parsed) items.push(parsed);
        });
        resolve(items);
      },
      error: (err) => reject(err)
    });
  });
}
