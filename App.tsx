import React, { useState, useEffect, useCallback } from 'react';
import { Market, AnalysisResult } from './types';
import { INITIAL_MARKETS } from './constants';
import { updateMarketData, generateInitialHistory } from './services/marketService';
import { analyzeMarket } from './services/geminiService';

// Components
import MarketCard from './components/MarketCard';
import TradingChart from './components/TradingChart';
import AnalysisPanel from './components/AnalysisPanel';
import IndicatorBadge from './components/IndicatorBadge';
import { BarChart3, LayoutDashboard, Zap, Activity } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [markets, setMarkets] = useState<Market[]>(() => {
    return INITIAL_MARKETS.map(m => ({
      ...m,
      history: generateInitialHistory(m, 50)
    }));
  });
  
  const [selectedMarketId, setSelectedMarketId] = useState<string>(INITIAL_MARKETS[0].id);
  const [analyses, setAnalyses] = useState<Record<string, AnalysisResult>>({});
  const [analyzing, setAnalyzing] = useState(false);

  // Derived state
  const selectedMarket = markets.find(m => m.id === selectedMarketId) || markets[0];
  const currentAnalysis = analyses[selectedMarketId];

  // Market Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prevMarkets => updateMarketData(prevMarkets));
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  // Analysis Handler
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

export default App;