import { Market } from './types';

export const INITIAL_MARKETS: Market[] = [
  {
    id: 'forex-eurusd',
    name: 'EUR/USD OTC',
    category: 'Forex',
    price: 1.0845,
    previousPrice: 1.0840,
    changePercent: 0.05,
    history: [],
    rsi: 52,
    macd: 0.0002,
    volatility: 'Low',
  },
  {
    id: 'forex-gbpusd',
    name: 'GBP/USD OTC',
    category: 'Forex',
    price: 1.2630,
    previousPrice: 1.2610,
    changePercent: 0.16,
    history: [],
    rsi: 58,
    macd: 0.0005,
    volatility: 'Medium',
  },
  {
    id: 'crypto-btc',
    name: 'BTC/USD OTC',
    category: 'Crypto',
    price: 64250.00,
    previousPrice: 63800.00,
    changePercent: 0.70,
    history: [],
    rsi: 65,
    macd: 120.5,
    volatility: 'High',
  },
  {
    id: 'crypto-eth',
    name: 'ETH/USD OTC',
    category: 'Crypto',
    price: 3450.00,
    previousPrice: 3420.00,
    changePercent: 0.88,
    history: [],
    rsi: 62,
    macd: 15.2,
    volatility: 'High',
  },
  {
    id: 'comm-gold',
    name: 'Gold (XAU) OTC',
    category: 'Commodities',
    price: 2340.50,
    previousPrice: 2335.00,
    changePercent: 0.24,
    history: [],
    rsi: 48,
    macd: -2.5,
    volatility: 'Medium',
  },
  {
    id: 'comm-silver',
    name: 'Silver (XAG) OTC',
    category: 'Commodities',
    price: 28.45,
    previousPrice: 28.20,
    changePercent: 0.89,
    history: [],
    rsi: 55,
    macd: 0.15,
    volatility: 'High',
  },
  {
    id: 'ind-us30',
    name: 'US30 OTC',
    category: 'Indices',
    price: 39100.00,
    previousPrice: 39150.00,
    changePercent: -0.13,
    history: [],
    rsi: 42,
    macd: -15.0,
    volatility: 'Medium',
  },
  {
    id: 'ind-nas100',
    name: 'NAS100 OTC',
    category: 'Indices',
    price: 18200.00,
    previousPrice: 18100.00,
    changePercent: 0.55,
    history: [],
    rsi: 68,
    macd: 45.0,
    volatility: 'Medium',
  },
  {
    id: 'syn-vol75',
    name: 'Vol75 Index OTC',
    category: 'Synthetics',
    price: 450000.00,
    previousPrice: 445000.00,
    changePercent: 1.12,
    history: [],
    rsi: 75,
    macd: 1200.0,
    volatility: 'High',
  },
];

export const SYSTEM_INSTRUCTION = `
Role:
You are an advanced AI-powered OTC Trading Bot designed to operate intelligently across 9 different OTC markets.

Core Objective:
Your primary goal is to analyze market data, detect high-probability trading opportunities, and assist in decision-making for OTC (Over-The-Counter) trading with accuracy, discipline, and risk control.

🔹 Output Format
For every analysis, respond in the following structured format (Use Markdown for bolding keys):

**Market**: [Market Name]
**Trend**: [Up / Down / Sideways]
**Signal**: [Buy / Sell / No Trade]
**Entry**: [Price]
**Stop Loss**: [Price]
**Take Profit**: [Price]
**Risk-Reward**: [Ratio]
**Confidence Level**: [Low / Medium / High]
**Reasoning**: [Clear technical explanation]

🔹 Bot Behavior
Act disciplined, logical, and non-emotional.
Do NOT guess trades.
If market conditions are unclear, respond with “No Trade – Market Not Favorable”.
Prioritize accuracy over frequency.
`;
