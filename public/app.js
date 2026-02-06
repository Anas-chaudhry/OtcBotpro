import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  BarChart3, LayoutDashboard, Zap, Activity, TrendingUp, TrendingDown, 
  ShieldAlert, Bot, RefreshCw, Sparkles 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- TYPES ---
// Note: In a real build step these are separate, but for a single file static export we keep them here.
// Babel Standalone will strip these out at runtime.

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

// --- CONSTANTS ---

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

// --- SERVICES ---

const getFluctuation = (price: number, volatility: 'Low' | 'Medium' | 'High') => {
  let multiplier = 0.0001;
  if (volatility === 'Medium') multiplier = 0.0005;
  if (volatility === 'High') multiplier = 0.0015;
  
  const direction = Math.random() > 0.48 ? 1 : -1;
  const change = price * multiplier * Math.random() * direction;
  return change;
};

const generateInitialHistory = (market: Market, count: number = 30): PricePoint[] => {
  const history: PricePoint[] = [];
  let currentPrice = market.price;
  const now = Date.now();
  
  for (let i = count; i > 0; i--) {
    history.push({
      time: new Date(now - i * 1000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: Number(currentPrice.toFixed(market.category === 'Forex' || market.category === 'Commodities' ? 4 : 2)),
    });
    currentPrice -= getFluctuation(currentPrice, market.volatility);
  }
  return history;
};

const updateMarketData = (markets: Market[]): Market[] => {
  return markets.map((market) => {
    const fluctuation = getFluctuation(market.price, market.volatility);
    const newPrice = market.price + fluctuation;
    
    let newRsi = market.rsi + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2);
    newRsi = Math.max(10, Math.min(90, newRsi));

    const macdChange = (Math.random() - 0.5) * (market.price * 0.0001);
    const newMacd = market.macd + macdChange;

    const newPoint: PricePoint = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: Number(newPrice.toFixed(market.category === 'Forex' || market.category === 'Commodities' ? 4 : 2)),
    };

    const newHistory = [...market.history, newPoint].slice(-50); 
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

// Simulated Gemini Analysis (Local Version)
const analyzeMarket = async (market: Market): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const isBullish = market.changePercent > 0;
  
  let trend = "Sideways";
  if (market.changePercent > 0.1) trend = "Up";
  if (market.changePercent < -0.1) trend = "Down";

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

  const entry = market.price;
  const digits = market.category === 'Forex' || market.category === 'Commodities' ? 4 : 2;
  
  const stopLossPercent = 0.005; 
  const takeProfitPercent = 0.01; 
  
  const stopLoss = signal === "Buy" 
    ? entry * (1 - stopLossPercent) 
    : entry * (1 + stopLossPercent);
    
  const takeProfit = signal === "Buy" 
    ? entry * (1 + takeProfitPercent) 
    : entry * (1 - takeProfitPercent);

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

// --- COMPONENTS ---

const IndicatorBadge = ({ label, value, color = "text-gray-300" }) => (
  <div className="flex flex-col bg-gray-900/50 p-2 rounded border border-gray-700">
    <span className="text-[10px] text-gray-500 uppercase font-semibold">{label}</span>
    <span className={`text-sm font-mono font-medium ${color}`}>{value}</span>
  </div>
);

const MarketCard = ({ market, isSelected, onClick }) => {
  const isPositive = market.changePercent >= 0;

  return (
    <div 
      onClick={onClick}
      className={`
        relative p-3 rounded-xl cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'bg-gradient-to-r from-blue-900/40 to-gray-800 border-blue-500/50 shadow-lg shadow-blue-900/10' 
          : 'bg-gray-800/40 border-transparent hover:bg-gray-800 hover:border-gray-700'}
        border
      `}
    >
      {isSelected && <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full"></div>}
      
      <div className="flex justify-between items-center mb-1 pl-2">
        <h3 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
          {market.name}
        </h3>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
        </span>
      </div>
      
      <div className="flex justify-between items-center pl-2">
        <p className="text-lg font-mono font-medium text-gray-200">
          {market.price.toLocaleString(undefined, { minimumFractionDigits: market.category === 'Forex' ? 4 : 2 })}
        </p>
        <div className={`opacity-50 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
           {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        </div>
      </div>
    </div>
  );
};

const TradingChart = ({ market }) => {
  const isPositive = market.changePercent >= 0;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="h-[400px] w-full bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={market.history}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#9ca3af', fontSize: 11 }} 
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fill: '#9ca3af', fontSize: 11 }} 
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
            itemStyle={{ color: '#f3f4f6' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={strokeColor} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnalysisPanel = ({ analysis, loading, onAnalyze }) => {
  return (
    <div className="w-full bg-gray-900/30 rounded-2xl border border-gray-800/60 backdrop-blur-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/60 bg-gray-900/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
             <Sparkles className="text-purple-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">AI Strategy Center</h2>
            <div className="text-xs text-gray-500 font-mono mt-1">POWERED BY PROBOT ANALYTICS</div>
          </div>
        </div>
        
        <button
          onClick={onAnalyze}
          disabled={loading}
          className={`
            px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg flex items-center gap-2
            ${loading 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/20 hover:shadow-blue-600/20'}
          `}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analyzing Market...' : 'Generate New Signal'}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 bg-gray-900/20 min-h-[300px]">
        {analysis ? (
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-blue-400 prose-li:text-gray-300">
            <ReactMarkdown>
              {analysis}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 border border-gray-700">
              <Bot size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">Algorithm Standby</h3>
            <p className="text-sm text-gray-500 max-w-md">Select a market from the list above and click "Generate New Signal" to run the technical analysis strategy.</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-800/60 bg-gray-900/40 text-xs text-gray-500 text-center">
         Analysis is for educational purposes only. Trading involves high risk.
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [markets, setMarkets] = useState(() => {
    return INITIAL_MARKETS.map(m => ({
      ...m,
      history: generateInitialHistory(m, 50)
    }));
  });
  
  const [selectedMarketId, setSelectedMarketId] = useState(INITIAL_MARKETS[0].id);
  const [analyses, setAnalyses] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  const selectedMarket = markets.find(m => m.id === selectedMarketId) || markets[0];
  const currentAnalysis = analyses[selectedMarketId];

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prevMarkets => updateMarketData(prevMarkets));
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const resultText = await analyzeMarket(selectedMarket);
      setAnalyses(prev => ({
        ...prev,
        [selectedMarket.id]: {
          marketId: selectedMarket.id,
          content: resultText,
          timestamp: Date.now()
        }
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  }, [selectedMarket]);

  return (
    <div className="min-h-screen w-full bg-[#0b0e14] text-gray-100 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0b0e14] to-[#000000]">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-gray-800/80 bg-[#0b0e14]/90 backdrop-blur-md flex justify-between items-center shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-blue-900/30 shadow-lg">
             <BarChart3 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              OTC ProBot <span className="text-blue-500">AI</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Connection
          </div>
        </div>
      </header>

      {/* Main Content - Vertical Stack */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8 pb-20">
        
        {/* Section 1: Market Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <LayoutDashboard className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-white tracking-wide">MARKET OVERVIEW</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markets.map(market => (
              <MarketCard
                key={market.id}
                market={market}
                isSelected={selectedMarketId === market.id}
                onClick={() => setSelectedMarketId(market.id)}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Chart & Statistics */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Activity className="text-green-500" size={20} />
            <h2 className="text-lg font-bold text-white tracking-wide">TECHNICAL ANALYSIS: {selectedMarket.name}</h2>
          </div>
          
          <div className="bg-gray-900/40 rounded-2xl p-1 border border-gray-800/60 shadow-2xl relative overflow-hidden">
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
             
             <div className="p-6 relative z-10">
                {/* Chart Header Info */}
                <div className="flex flex-wrap justify-between items-end mb-6 gap-4">
                   <div>
                      <span className="text-sm font-medium text-gray-400 block mb-1">{selectedMarket.category}</span>
                      <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-mono font-bold text-white tracking-tight">
                          {selectedMarket.price.toLocaleString(undefined, { minimumFractionDigits: selectedMarket.category === 'Forex' ? 4 : 2 })}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-sm font-bold flex items-center gap-1 ${selectedMarket.changePercent >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {selectedMarket.changePercent >= 0 ? '+' : ''}{selectedMarket.changePercent.toFixed(2)}%
                        </span>
                      </div>
                   </div>
                   
                   <div className="flex gap-4">
                      <div className="text-right">
                         <div className="text-xs text-gray-500 uppercase mb-1">RSI (14)</div>
                         <div className={`font-mono font-bold ${selectedMarket.rsi > 70 ? 'text-red-400' : selectedMarket.rsi < 30 ? 'text-green-400' : 'text-blue-400'}`}>
                           {selectedMarket.rsi}
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-xs text-gray-500 uppercase mb-1">MACD</div>
                         <div className={`font-mono font-bold ${selectedMarket.macd > 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {selectedMarket.macd.toFixed(4)}
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-xs text-gray-500 uppercase mb-1">Volatility</div>
                         <div className={`font-mono font-bold ${selectedMarket.volatility === 'High' ? 'text-orange-400' : 'text-gray-300'}`}>
                           {selectedMarket.volatility}
                         </div>
                      </div>
                   </div>
                </div>

                <TradingChart market={selectedMarket} />

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                   <IndicatorBadge label="Session" value="OTC GLOBAL" color="text-purple-300" />
                   <IndicatorBadge label="24h High" value={(selectedMarket.price * 1.01).toFixed(selectedMarket.category === 'Forex' ? 4 : 2)} />
                   <IndicatorBadge label="24h Low" value={(selectedMarket.price * 0.99).toFixed(selectedMarket.category === 'Forex' ? 4 : 2)} />
                   <IndicatorBadge label="Trend Strength" value={Math.abs(selectedMarket.changePercent) > 0.5 ? 'Strong' : 'Weak'} color={Math.abs(selectedMarket.changePercent) > 0.5 ? 'text-white' : 'text-gray-500'} />
                </div>
             </div>
          </div>
        </section>

        {/* Section 3: AI Analysis */}
        <section>
           <div className="flex items-center gap-2 mb-4 px-2">
             <Zap className="text-purple-500" size={20} />
             <h2 className="text-lg font-bold text-white tracking-wide">INTELLIGENT STRATEGY</h2>
           </div>
           <AnalysisPanel 
             analysis={currentAnalysis?.content || null} 
             loading={analyzing} 
             onAnalyze={handleAnalyze} 
           />
        </section>

      </main>
    </div>
  );
};

// --- MOUNT ---

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}