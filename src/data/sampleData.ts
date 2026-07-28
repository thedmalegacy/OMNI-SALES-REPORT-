import { OrderItem } from '../types';

export const INITIAL_SAMPLE_ORDERS: OrderItem[] = [
  // --- AMAZON ORDERS ---
  {
    id: 'amz-101',
    orderId: '408-1120394-8839201',
    date: '2026-07-25',
    channel: 'amazon',
    sku: 'TSHIRT-BLK-M',
    productName: 'Premium Cotton Crew Neck T-Shirt (Black, M)',
    quantity: 2,
    grossAmount: 1198,
    discount: 0,
    netAmount: 1198,
    marketplaceFee: 179.70, // 15% referral fee
    shippingFee: 85.00, // Easy Ship fee
    cogs: 360, // 180 per unit
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 59.90,
    calculatedNetProfit: 573.30,
    calculatedMarginPercent: 47.85
  },
  {
    id: 'amz-102',
    orderId: '408-8839201-3329104',
    date: '2026-07-24',
    channel: 'amazon',
    sku: 'HOODIE-GRY-L',
    productName: 'Fleece Heavyweight Hoodie (Grey, L)',
    quantity: 1,
    grossAmount: 1899,
    discount: 100,
    netAmount: 1799,
    marketplaceFee: 269.85,
    shippingFee: 110.00,
    cogs: 650,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 89.95,
    calculatedNetProfit: 769.15,
    calculatedMarginPercent: 42.75
  },
  {
    id: 'amz-103',
    orderId: '408-9920183-4412093',
    date: '2026-07-23',
    channel: 'amazon',
    sku: 'JEANS-SLIM-32',
    productName: 'Stretch Denim Slim Fit Jeans (32)',
    quantity: 1,
    grossAmount: 2299,
    discount: 0,
    netAmount: 2299,
    marketplaceFee: 344.85,
    shippingFee: 95.00,
    cogs: 820,
    status: 'returned',
    refundAmount: 2299,
    taxAmount: 0,
    calculatedNetProfit: -439.85, // Lost shipping fee, referral charge & reverse shipping
    calculatedMarginPercent: -19.13
  },
  {
    id: 'amz-104',
    orderId: '408-7712039-1102938',
    date: '2026-07-22',
    channel: 'amazon',
    sku: 'CAP-NAVY-OS',
    productName: 'Embroidered Baseball Cap (Navy)',
    quantity: 3,
    grossAmount: 1497,
    discount: 150,
    netAmount: 1347,
    marketplaceFee: 202.05,
    shippingFee: 75.00,
    cogs: 450,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 67.35,
    calculatedNetProfit: 619.95,
    calculatedMarginPercent: 46.02
  },

  // --- FLIPKART ORDERS ---
  {
    id: 'fk-201',
    orderId: 'OD330192840192',
    date: '2026-07-25',
    channel: 'flipkart',
    sku: 'TSHIRT-BLK-M',
    productName: 'Premium Cotton Crew Neck T-Shirt (Black, M)',
    quantity: 3,
    grossAmount: 1737,
    discount: 100,
    netAmount: 1637,
    marketplaceFee: 229.18, // Commission + Fixed Fee + Collection fee
    shippingFee: 120.00,
    cogs: 540,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 81.85,
    calculatedNetProfit: 747.82,
    calculatedMarginPercent: 45.68
  },
  {
    id: 'fk-202',
    orderId: 'OD330192840881',
    date: '2026-07-24',
    channel: 'flipkart',
    sku: 'JCKT-BOMBER-L',
    productName: 'Water-Resistant Bomber Jacket (Olive, L)',
    quantity: 1,
    grossAmount: 2999,
    discount: 200,
    netAmount: 2799,
    marketplaceFee: 391.86,
    shippingFee: 140.00,
    cogs: 1100,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 139.95,
    calculatedNetProfit: 1167.14,
    calculatedMarginPercent: 41.70
  },
  {
    id: 'fk-203',
    orderId: 'OD330192841102',
    date: '2026-07-22',
    channel: 'flipkart',
    sku: 'HOODIE-GRY-L',
    productName: 'Fleece Heavyweight Hoodie (Grey, L)',
    quantity: 2,
    grossAmount: 3798,
    discount: 0,
    netAmount: 3798,
    marketplaceFee: 531.72,
    shippingFee: 180.00,
    cogs: 1300,
    status: 'returned',
    refundAmount: 3798,
    taxAmount: 0,
    calculatedNetProfit: -711.72,
    calculatedMarginPercent: -18.74
  },

  // --- MEESHO ORDERS ---
  {
    id: 'msh-301',
    orderId: 'MSO-99018239-1',
    date: '2026-07-25',
    channel: 'meesho',
    sku: 'TSHIRT-BLK-M',
    productName: 'Premium Cotton Crew Neck T-Shirt (Black, M)',
    quantity: 5,
    grossAmount: 2495,
    discount: 0,
    netAmount: 2495,
    marketplaceFee: 0, // 0% commission model
    shippingFee: 320.00, // Higher seller shipping
    cogs: 900,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 124.75,
    calculatedNetProfit: 1275.00,
    calculatedMarginPercent: 51.10
  },
  {
    id: 'msh-302',
    orderId: 'MSO-99018239-2',
    date: '2026-07-23',
    channel: 'meesho',
    sku: 'SOCKS-3PK-WHT',
    productName: 'Breathable Ankle Socks (Pack of 3)',
    quantity: 4,
    grossAmount: 1196,
    discount: 50,
    netAmount: 1146,
    marketplaceFee: 0,
    shippingFee: 260.00,
    cogs: 320,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 57.30,
    calculatedNetProfit: 566.00,
    calculatedMarginPercent: 49.39
  },
  {
    id: 'msh-303',
    orderId: 'MSO-99018239-3',
    date: '2026-07-21',
    channel: 'meesho',
    sku: 'CAP-NAVY-OS',
    productName: 'Embroidered Baseball Cap (Navy)',
    quantity: 2,
    grossAmount: 998,
    discount: 0,
    netAmount: 998,
    marketplaceFee: 0,
    shippingFee: 180.00,
    cogs: 300,
    status: 'returned', // RTO high on Meesho
    refundAmount: 998,
    taxAmount: 0,
    calculatedNetProfit: -180.00,
    calculatedMarginPercent: -18.04
  },

  // --- BRAND WEBSITE (DIRECT TO CONSUMER) ORDERS ---
  {
    id: 'web-401',
    orderId: '#DTC-10482',
    date: '2026-07-25',
    channel: 'website',
    sku: 'HOODIE-GRY-L',
    productName: 'Fleece Heavyweight Hoodie (Grey, L)',
    quantity: 2,
    grossAmount: 3998,
    discount: 399, // 10% WELCOME discount
    netAmount: 3599,
    marketplaceFee: 71.98, // 2% Razorpay / Stripe payment gateway fee
    shippingFee: 90.00, // Direct courier contract fee
    cogs: 1300,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 179.95,
    calculatedNetProfit: 2137.02,
    calculatedMarginPercent: 59.38
  },
  {
    id: 'web-402',
    orderId: '#DTC-10483',
    date: '2026-07-24',
    channel: 'website',
    sku: 'JCKT-BOMBER-L',
    productName: 'Water-Resistant Bomber Jacket (Olive, L)',
    quantity: 1,
    grossAmount: 3499,
    discount: 350,
    netAmount: 3149,
    marketplaceFee: 62.98,
    shippingFee: 90.00,
    cogs: 1100,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 157.45,
    calculatedNetProfit: 1896.02,
    calculatedMarginPercent: 60.21
  },
  {
    id: 'web-403',
    orderId: '#DTC-10484',
    date: '2026-07-22',
    channel: 'website',
    sku: 'TSHIRT-BLK-M',
    productName: 'Premium Cotton Crew Neck T-Shirt (Black, M)',
    quantity: 4,
    grossAmount: 2396,
    discount: 240,
    netAmount: 2156,
    marketplaceFee: 43.12,
    shippingFee: 90.00,
    cogs: 720,
    status: 'delivered',
    refundAmount: 0,
    taxAmount: 107.80,
    calculatedNetProfit: 1302.88,
    calculatedMarginPercent: 60.43
  }
];

export const CSV_TEMPLATES = {
  amazon: `Order ID,SKU,Product Title,Order Date,Item Price,Commission,Shipping Fee,Order Status,Refund Amount,Quantity
408-1120394-8839201,TSHIRT-BLK-M,Premium Cotton Crew Neck T-Shirt (Black M),2026-07-25,1198,179.70,85.00,Delivered,0,2
408-8839201-3329104,HOODIE-GRY-L,Fleece Heavyweight Hoodie (Grey L),2026-07-24,1799,269.85,110.00,Delivered,0,1
408-9920183-4412093,JEANS-SLIM-32,Stretch Denim Slim Fit Jeans (32),2026-07-23,2299,344.85,95.00,Returned,2299,1`,

  flipkart: `Order ID,FSKU,Title,Order Date,Selling Price,Marketplace Fee,Shipping Fee,Return Type,Refunded Amount,Quantity
OD330192840192,TSHIRT-BLK-M,Premium Cotton Crew Neck T-Shirt,2026-07-25,1637,229.18,120.00,None,0,3
OD330192840881,JCKT-BOMBER-L,Water-Resistant Bomber Jacket,2026-07-24,2799,391.86,140.00,None,0,1
OD330192841102,HOODIE-GRY-L,Fleece Heavyweight Hoodie,2026-07-22,3798,531.72,180.00,Customer Return,3798,2`,

  meesho: `Sub Order ID,SKU ID,Product Name,Order Date,Supplier Discounted Price,Commission Taxable Amount,Shipping Charge,Order Status,Refund Amount,Quantity
MSO-99018239-1,TSHIRT-BLK-M,Premium Cotton Crew Neck T-Shirt,2026-07-25,2495,0,320.00,Delivered,0,5
MSO-99018239-2,SOCKS-3PK-WHT,Breathable Ankle Socks 3PK,2026-07-23,1146,0,260.00,Delivered,0,4
MSO-99018239-3,CAP-NAVY-OS,Embroidered Baseball Cap,2026-07-21,998,0,180.00,RTO,998,2`,

  website: `Name,Lineitem sku,Lineitem name,Created at,Lineitem price,Lineitem quantity,Financial Status,Shipping,Total
#DTC-10482,HOODIE-GRY-L,Fleece Heavyweight Hoodie,2026-07-25,1799.50,2,paid,90.00,3599.00
#DTC-10483,JCKT-BOMBER-L,Water-Resistant Bomber Jacket,2026-07-24,3149.00,1,paid,90.00,3149.00
#DTC-10484,TSHIRT-BLK-M,Premium Cotton Crew Neck T-Shirt,2026-07-22,539.00,4,paid,90.00,2156.00`
};
