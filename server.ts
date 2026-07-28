import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Endpoint: AI Profit & Loss Audit
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { summaryData, currency, channelBreakdown } = req.body;

      const ai = getAiClient();

      const prompt = `
You are an expert E-Commerce Financial Consultant & E-Commerce Operations Auditor.
Analyze the following multi-channel sales report dataset and provide strategic, actionable insights for the seller.

Currency: ${currency || 'INR'}
Financial Overview:
- Gross Sales: ${summaryData.grossSales}
- Net Revenue (After Returns): ${summaryData.netRealizedRevenue}
- Total COGS (Cost of Goods): ${summaryData.totalCOGS}
- Marketplace Fees & Commissions: ${summaryData.totalMarketplaceFees}
- Shipping & Logistics Costs: ${summaryData.totalShippingFees}
- Net Operating Profit: ${summaryData.netOperatingProfit}
- Net Profit Margin: ${summaryData.netMarginPercent}%

Channel Breakdown:
${JSON.stringify(channelBreakdown, null, 2)}

Provide your analysis formatted as JSON matching this schema:
{
  "executiveSummary": "2-3 sentence overview of overall profitability across Amazon, Flipkart, Meesho, and DTC Website.",
  "topChannelInsight": "Detailed comparison of which channel delivers the best net margin vs highest volume.",
  "unprofitableSkuAlerts": ["Alert 1 on high return rate or negative profit", "Alert 2 on fee leakages"],
  "feeOptimizationTips": ["Actionable tip to reduce marketplace commissions or shipping costs"],
  "growthActionPlan": ["Step 1 to scale direct website sales or re-negotiate courier rates", "Step 2 to re-price low margin SKUs"]
}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an e-commerce financial CFO providing sharp, high-yield advice to online sellers.',
        },
      });

      const text = response.text || '{}';
      const parsedResult = JSON.parse(text);
      res.json({ success: true, analysis: parsedResult });
    } catch (error: any) {
      console.error('Error generating AI insights:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to generate AI insights.' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`E-Commerce Analytics Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
