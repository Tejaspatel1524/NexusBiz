import React from 'react';
import { motion } from 'framer-motion';
import { Globe, DollarSign, TrendingUp, Building2, ExternalLink } from 'lucide-react';

interface ValidationData {
    marketSize: string;
    marketGrowth: string;
    competitors: { name: string; description: string; }[];
    pricingBenchmark: { low: string; mid: string; high: string; };
}

interface ValidationCardProps {
    data?: ValidationData;
    industry?: string;
    className?: string;
}

// Default validation data based on industry
const getDefaultData = (industry: string = 'Technology'): ValidationData => ({
    marketSize: industry === 'Technology' ? '$850B+ Global Market' : '$500B+ Market Size',
    marketGrowth: '12.4% CAGR (2024-2030)',
    competitors: [
        { name: 'Market Leader Corp', description: 'Established player with 25% market share' },
        { name: 'Innovative Startup', description: 'Fast-growing competitor with unique approach' },
        { name: 'Traditional Provider', description: 'Legacy company transitioning to digital' }
    ],
    pricingBenchmark: { low: '$29/mo', mid: '$99/mo', high: '$299/mo' }
});

const ValidationCard: React.FC<ValidationCardProps> = ({ data, industry = 'Technology', className = '' }) => {
    const validationData = data || getDefaultData(industry);

    return (
        <motion.div
            className={`liquid-glass overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="p-6 border-b border-theme">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                        <Globe size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-theme-primary">Market Validation</h3>
                        <p className="text-xs text-theme-muted">Industry insights and competitive analysis</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Market Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-theme-tertiary/30 border border-theme">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={14} className="text-green-400" />
                            <span className="text-[10px] text-theme-muted uppercase tracking-wide">Market Size</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">{validationData.marketSize}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-tertiary/30 border border-theme">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={14} className="text-indigo-400" />
                            <span className="text-[10px] text-theme-muted uppercase tracking-wide">Growth Rate</span>
                        </div>
                        <div className="text-lg font-bold text-indigo-400">{validationData.marketGrowth}</div>
                    </div>
                </div>

                {/* Competitors */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Building2 size={14} className="text-theme-muted" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-theme-secondary">Top Competitors</span>
                    </div>
                    <div className="space-y-2">
                        {validationData.competitors.map((comp, i) => (
                            <div key={i} className="p-3 rounded-lg bg-theme-tertiary/20 border border-theme flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                                <div>
                                    <div className="font-semibold text-theme-primary text-sm">{comp.name}</div>
                                    <div className="text-xs text-theme-muted">{comp.description}</div>
                                </div>
                                <ExternalLink size={14} className="text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Benchmark */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign size={14} className="text-theme-muted" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-theme-secondary">Pricing Benchmarks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 rounded-lg bg-theme-tertiary/20 border border-theme text-center">
                            <div className="text-[10px] text-theme-muted uppercase mb-1">Entry</div>
                            <div className="font-bold text-theme-primary">{validationData.pricingBenchmark.low}</div>
                        </div>
                        <div className="flex-1 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-center">
                            <div className="text-[10px] text-indigo-400 uppercase mb-1">Recommended</div>
                            <div className="font-bold text-indigo-400">{validationData.pricingBenchmark.mid}</div>
                        </div>
                        <div className="flex-1 p-3 rounded-lg bg-theme-tertiary/20 border border-theme text-center">
                            <div className="text-[10px] text-theme-muted uppercase mb-1">Premium</div>
                            <div className="font-bold text-theme-primary">{validationData.pricingBenchmark.high}</div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-theme-muted text-center">
                    * Market data is estimated based on industry benchmarks. Conduct your own research for accuracy.
                </p>
            </div>
        </motion.div>
    );
};

export default ValidationCard;
