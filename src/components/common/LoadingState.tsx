import React from 'react';

const LoadingState: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center space-y-8 p-4">
            <div className="relative w-24 h-24">
                {/* Geometric Spinner */}
                <div className="absolute inset-0 border-2 border-blue animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-2 border-2 border-white animate-[spin_2s_linear_infinite_reverse]" />
                <div className="absolute inset-4 border-2 border-gray-200 animate-[spin_1s_linear_infinite]" />
            </div>

            <div className="text-center space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-widest animate-pulse">
                    Generating your business empire...
                </h2>
                <div className="max-w-xs mx-auto h-1 bg-gray-400 overflow-hidden">
                    <div className="h-full bg-blue animate-[loading_2s_ease-in-out_infinite]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-200">
                    Analyzing market volatility and competitive vectors
                </p>
            </div>

            <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 40%; }
          100% { width: 0%; transform: translateX(400%); }
        }
      `}</style>
        </div>
    );
};

export default LoadingState;
