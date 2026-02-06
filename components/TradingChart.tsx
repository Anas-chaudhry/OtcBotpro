import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Market } from '../types';

interface TradingChartProps {
  market: Market;
}

const TradingChart: React.FC<TradingChartProps> = ({ market }) => {
  const isPositive = market.changePercent >= 0;
  const strokeColor = isPositive ? '#10b981' : '#ef4444'; // green-500 : red-500
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

export default TradingChart;