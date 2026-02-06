import React from 'react';
import { Market } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  isSelected: boolean;
  onClick: () => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ market, isSelected, onClick }) => {
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

export default MarketCard;