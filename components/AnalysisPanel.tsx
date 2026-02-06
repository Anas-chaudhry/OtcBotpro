import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: string | null;
  loading: boolean;
  onAnalyze: () => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, loading, onAnalyze }) => {
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

export default AnalysisPanel;