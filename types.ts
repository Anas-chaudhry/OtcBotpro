export type MarketCategory = 'Forex' | 'Crypto' | 'Commodities' | 'Indices' | 'Synthetics';

export interface PricePoint {
  time: string;
  price: number;
}

export interface Market {
  id: string;
  name: string;
  category: MarketCategory;
  price: number;
  previousPrice: number;
  changePercent: number;
  history: PricePoint[];
  rsi: number;
  macd: number;
  volatility: 'Low' | 'Medium' | 'High';
}

export interface AnalysisResult {
  marketId: string;
  content: string;
  timestamp: number;
}
