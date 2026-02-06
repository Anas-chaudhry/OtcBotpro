import { Market, PricePoint } from '../types';

// Helper to generate a random fluctuation based on volatility
const getFluctuation = (price: number, volatility: 'Low' | 'Medium' | 'High') => {
  let multiplier = 0.0001;
  if (volatility === 'Medium') multiplier = 0.0005;
  if (volatility === 'High') multiplier = 0.0015;
  
  const direction = Math.random() > 0.48 ? 1 : -1; // Slight trend bias simulation could go here
  const change = price * multiplier * Math.random() * direction;
  return change;
};

// Generate initial history for the charts so they aren't empty on load
export const generateInitialHistory = (market: Market, count: number = 30): PricePoint[] => {
  const history: PricePoint[] = [];
  let currentPrice = market.price;
  const now = Date.now();
  
  for (let i = count; i > 0; i--) {
    history.push({
      time: new Date(now - i * 1000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), // 5 second intervals backwards
      price: Number(currentPrice.toFixed(market.category === 'Forex' || market.category === 'Commodities' ? 4 : 2)),
    });
    // Reverse walk to generate past data
    currentPrice -= getFluctuation(currentPrice, market.volatility);
  }
  return history;
};

export const updateMarketData = (markets: Market[]): Market[] => {
  return markets.map((market) => {
    const fluctuation = getFluctuation(market.price, market.volatility);
    const newPrice = market.price + fluctuation;
    
    // Simple simulated RSI drift
    let newRsi = market.rsi + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2);
    newRsi = Math.max(10, Math.min(90, newRsi));

    // Simple simulated MACD drift
    const macdChange = (Math.random() - 0.5) * (market.price * 0.0001);
    const newMacd = market.macd + macdChange;

    const newPoint: PricePoint = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: Number(newPrice.toFixed(market.category === 'Forex' || market.category === 'Commodities' ? 4 : 2)),
    };

    const newHistory = [...market.history, newPoint].slice(-50); // Keep last 50 points

    const changePercent = ((newPrice - market.history[0]?.price || market.price) / (market.history[0]?.price || market.price)) * 100;

    return {
      ...market,
      previousPrice: market.price,
      price: Number(newPrice.toFixed(market.category === 'Forex' || market.category === 'Commodities' ? 4 : 2)),
      changePercent: Number(changePercent.toFixed(2)),
      history: newHistory,
      rsi: Number(newRsi.toFixed(1)),
      macd: Number(newMacd.toFixed(4)),
    };
  });
};
