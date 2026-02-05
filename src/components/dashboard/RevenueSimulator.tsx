import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    DollarSign,
    Users,
    Receipt,
    ChevronDown,
    Zap,
    Target,
    Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueSimulatorProps {
    investmentNeeded: string;
    timeline: string;
    className?: string;
}

interface SimulationParams {
    price: number;
    customersPerMonth: number;
    monthlyExpenses: number;
    growthRate: number;
}

// Parse investment string to number
const parseInvestment = (investment: string): number => {
    let amount = 50000;
    const match = investment.match(/\$?([\d,]+)/);
    if (match) {
        amount = parseInt(match[1].replace(/,/g, ''));
        if (investment.toLowerCase().includes('k')) amount *= 1000;
        if (investment.toLowerCase().includes('m')) amount *= 1000000;
    }
    return amount;
};

// Format currency
const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return '$0';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
};

const RevenueSimulator: React.FC<RevenueSimulatorProps> = ({
    investmentNeeded,
    timeline: _timeline,
    className = ''
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const baseInvestment = useMemo(() => parseInvestment(investmentNeeded), [investmentNeeded]);

    // Default simulation parameters based on investment
    const [params, setParams] = useState<SimulationParams>({
        price: Math.round(baseInvestment * 0.01),
        customersPerMonth: 20,
        monthlyExpenses: Math.round(baseInvestment * 0.05),
        growthRate: 15
    });

    // Generate 12-month projection data
    const projectionData = useMemo(() => {
        const data = [];
        let customers = params.customersPerMonth;
        let cumulativeRevenue = 0;

        for (let month = 1; month <= 12; month++) {
            const monthlyRevenue = customers * params.price;
            const monthlyProfit = monthlyRevenue - params.monthlyExpenses;
            cumulativeRevenue += monthlyRevenue;

            data.push({
                month: `M${month}`,
                revenue: Math.round(monthlyRevenue),
                profit: Math.round(monthlyProfit),
                customers: Math.round(customers),
                cumulative: Math.round(cumulativeRevenue)
            });

            customers *= (1 + params.growthRate / 100);
        }

        return data;
    }, [params]);

    // Calculate key metrics
    const metrics = useMemo(() => {
        const yearOneRevenue = projectionData.reduce((sum, d) => sum + d.revenue, 0);
        const yearOneProfit = projectionData.reduce((sum, d) => sum + d.profit, 0);
        const breakEvenMonth = projectionData.findIndex(d => d.cumulative >= baseInvestment);
        const roi = ((yearOneProfit - baseInvestment) / baseInvestment * 100);
        const finalCustomers = projectionData[11]?.customers || 0;

        return { yearOneRevenue, yearOneProfit, breakEvenMonth: breakEvenMonth > 0 ? breakEvenMonth + 1 : 'N/A', roi, finalCustomers };
    }, [projectionData, baseInvestment]);

    const SliderInput = ({ label, value, min, max, step, icon: Icon, format = (v: number) => v.toString(), onChange }: {
        label: string; value: number; min: number; max: number; step: number; icon: React.ElementType; format?: (v: number) => string; onChange: (v: number) => void;
    }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-theme-secondary">
                    <Icon size={14} className="text-indigo-400" />
                    {label}
                </span>
                <span className="text-sm font-bold text-theme-primary">{format(value)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-theme-tertiary"
            />
        </div>
    );

    return (
        <motion.div
            className={`liquid-glass overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header */}
            <div className="p-6 cursor-pointer flex items-center justify-between" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-theme-primary">Revenue Simulator</h3>
                        <p className="text-xs text-theme-muted">Interactive financial projections</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-theme-tertiary/50">
                        <div className="text-right">
                            <div className="text-[10px] text-theme-muted uppercase">Year 1 Revenue</div>
                            <div className="text-sm font-bold text-green-400">{formatCurrency(metrics.yearOneRevenue)}</div>
                        </div>
                        <div className="w-px h-8 bg-theme-border"></div>
                        <div className="text-right">
                            <div className="text-[10px] text-theme-muted uppercase">ROI</div>
                            <div className={`text-sm font-bold ${metrics.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {metrics.roi >= 0 ? '+' : ''}{metrics.roi.toFixed(0)}%
                            </div>
                        </div>
                    </div>

                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="w-8 h-8 rounded-lg bg-theme-tertiary flex items-center justify-center">
                        <ChevronDown size={18} className="text-theme-secondary" />
                    </motion.div>
                </div>
            </div>

            {/* Expandable Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-6 space-y-6">
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <MetricCard icon={DollarSign} label="Year 1 Revenue" value={formatCurrency(metrics.yearOneRevenue)} color="green" />
                                <MetricCard icon={Target} label="Year 1 Profit" value={formatCurrency(metrics.yearOneProfit)} color={metrics.yearOneProfit >= 0 ? 'green' : 'red'} />
                                <MetricCard icon={Calendar} label="Break-even" value={typeof metrics.breakEvenMonth === 'number' ? `Month ${metrics.breakEvenMonth}` : 'N/A'} color="indigo" />
                                <MetricCard icon={Users} label="Customers (M12)" value={Math.round(metrics.finalCustomers).toLocaleString()} color="purple" />
                            </div>

                            {/* Revenue Chart */}
                            <div className="p-4 rounded-xl bg-theme-tertiary/30 border border-theme">
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={projectionData}>
                                            <defs>
                                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickFormatter={(value) => formatCurrency(value)} />
                                            <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px' }} />
                                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" />
                                            <Area type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} fill="url(#profitGradient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-center gap-6 mt-4">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-xs text-theme-muted">Revenue</span></div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs text-theme-muted">Profit</span></div>
                                </div>
                            </div>

                            {/* Interactive Sliders */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <SliderInput label="Price per Sale" value={params.price} min={10} max={Math.max(5000, baseInvestment * 0.1)} step={10} icon={DollarSign} format={(v) => formatCurrency(v)} onChange={(v) => setParams(p => ({ ...p, price: v }))} />
                                <SliderInput label="Customers/Month (Start)" value={params.customersPerMonth} min={1} max={500} step={1} icon={Users} onChange={(v) => setParams(p => ({ ...p, customersPerMonth: v }))} />
                                <SliderInput label="Monthly Expenses" value={params.monthlyExpenses} min={1000} max={Math.max(50000, baseInvestment * 0.2)} step={500} icon={Receipt} format={(v) => formatCurrency(v)} onChange={(v) => setParams(p => ({ ...p, monthlyExpenses: v }))} />
                                <SliderInput label="Monthly Growth Rate" value={params.growthRate} min={0} max={50} step={1} icon={Zap} format={(v) => `${v}%`} onChange={(v) => setParams(p => ({ ...p, growthRate: v }))} />
                            </div>

                            <p className="text-[10px] text-theme-muted text-center">* These projections are estimates based on your inputs. Actual results may vary.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const MetricCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: 'green' | 'red' | 'indigo' | 'purple'; }) => {
    const colorClasses = { green: 'text-green-400 bg-green-500/10', red: 'text-red-400 bg-red-500/10', indigo: 'text-indigo-400 bg-indigo-500/10', purple: 'text-purple-400 bg-purple-500/10' };
    return (
        <div className="p-4 rounded-xl bg-theme-tertiary/30 border border-theme">
            <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}><Icon size={16} /></div>
            <div className="text-[10px] text-theme-muted uppercase tracking-wide">{label}</div>
            <div className={`text-lg font-bold ${colorClasses[color].split(' ')[0]}`}>{value}</div>
        </div>
    );
};

export default RevenueSimulator;
