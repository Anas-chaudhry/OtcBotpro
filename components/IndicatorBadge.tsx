import React from 'react';

interface IndicatorBadgeProps {
  label: string;
  value: string | number;
  color?: string;
}

const IndicatorBadge: React.FC<IndicatorBadgeProps> = ({ label, value, color = "text-gray-300" }) => (
  <div className="flex flex-col bg-gray-900/50 p-2 rounded border border-gray-700">
    <span className="text-[10px] text-gray-500 uppercase font-semibold">{label}</span>
    <span className={`text-sm font-mono font-medium ${color}`}>{value}</span>
  </div>
);

export default IndicatorBadge;
