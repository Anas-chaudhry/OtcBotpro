import { Market } from "../types";

// Simulated Analysis Service
// This replaces the external Gemini API with an internal algorithmic generator
// to allow the project to run publicly without API keys.

export const analyzeMarket = async (market: Market): Promise<string> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  const isBullish = market.changePercent > 0;
  const isStrong = Math.abs(market.changePercent) > 0.5;
  
  // Determine Trend
  let trend = "Sideways";
  if (market.changePercent > 0.1) trend = "Up";
  if (market.changePercent < -0.1) trend = "Down";

  // Determine Signal based on simple technical logic
  let signal = "No Trade";
  let confidence = "Low";
  
  if (market.rsi < 30 && isBullish) {
    signal = "Buy";
    confidence = "High";
  } else if (market.rsi > 70 && !isBullish) {
    signal = "Sell";
    confidence = "High";
  } else if (Math.abs(market.macd) > 0.0002) {
    signal = isBullish ? "Buy" : "Sell";
    confidence = "Medium";
  }

  // Calculate Levels
  const entry = market.price;
  const digits = market.category === 'Forex' || market.category === 'Commodities' ? 4 : 2;
  
  // Simple Risk Management Calculation
  const stopLossPercent = 0.005; // 0.5% risk
  const takeProfitPercent = 0.01; // 1% reward
  
  const stopLoss = signal === "Buy" 
    ? entry * (1 - stopLossPercent) 
    : entry * (1 + stopLossPercent);
    
  const takeProfit = signal === "Buy" 
    ? entry * (1 + takeProfitPercent) 
    : entry * (1 - takeProfitPercent);

  // Generate Markdown Response
  return `
**Market**: ${market.name}
**Trend**: ${trend}
**Signal**: ${signal}
**Entry**: ${entry.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}
**Stop Loss**: ${stopLoss.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}
**Take Profit**: ${takeProfit.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}
**Risk-Reward**: 1:2
**Confidence Level**: ${confidence}

**Reasoning**:
Internal technical algorithms detected ${trend.toLowerCase()} momentum. RSI is currently at **${market.rsi}**, which indicates ${market.rsi > 70 ? "overbought" : market.rsi < 30 ? "oversold" : "neutral"} conditions. MACD divergence suggests potential ${signal === "Buy" ? "upward" : signal === "Sell" ? "downward" : "ranging"} movement. Volatility is **${market.volatility}**, suggesting ${market.volatility === "High" ? "caution with wider stops" : "standard position sizing"}.
`;
};