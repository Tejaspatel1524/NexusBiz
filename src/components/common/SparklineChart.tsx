import React from 'react';
import { motion } from 'framer-motion';

interface SparklineChartProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    showArea?: boolean;
    className?: string;
}

/**
 * Generate realistic revenue data based on investment and timeline
 * Uses industry-standard growth curves with realistic startup patterns
 * @param investment - Investment string like "$250,000"
 * @param timeline - Timeline string like "12 months"
 * @returns Array of 6 quarterly revenue projections
 */
export const generateRevenueData = (investment: string, timeline: string): number[] => {
    // Parse investment amount
    let investmentAmount = 50000; // default
    const investMatch = investment.match(/\$?([\d,]+)/);
    if (investMatch) {
        investmentAmount = parseInt(investMatch[1].replace(/,/g, ''));
        if (investment.toLowerCase().includes('k')) investmentAmount *= 1000;
        if (investment.toLowerCase().includes('m')) investmentAmount *= 1000000;
    }

    // Parse timeline in months
    let months = 12;
    const timeMatch = timeline.match(/(\d+)/);
    if (timeMatch) months = parseInt(timeMatch[1]);

    // Create a seed from investment for consistent "random" variation per idea
    const seed = investmentAmount % 100;

    // Realistic startup revenue patterns based on investment tier
    // Tier 1: Small ($10K-$50K) - Slower growth, bootstrapped
    // Tier 2: Medium ($50K-$200K) - Moderate growth, some runway
    // Tier 3: Large ($200K+) - Faster scaling with proper funding

    let monthlyGrowthRate: number;
    let initialRevenuePercent: number;

    if (investmentAmount < 50000) {
        monthlyGrowthRate = 0.08 + (seed / 1000); // 8-18% monthly growth
        initialRevenuePercent = 0.03; // Start at 3% of investment
    } else if (investmentAmount < 200000) {
        monthlyGrowthRate = 0.12 + (seed / 1000); // 12-22% monthly growth
        initialRevenuePercent = 0.05; // Start at 5% of investment
    } else {
        monthlyGrowthRate = 0.15 + (seed / 1000); // 15-25% monthly growth
        initialRevenuePercent = 0.08; // Start at 8% of investment
    }

    // Adjust growth based on timeline aggressiveness
    if (months <= 6) {
        monthlyGrowthRate *= 1.2; // Aggressive short timeline
    } else if (months >= 18) {
        monthlyGrowthRate *= 0.8; // Conservative long timeline
    }

    // Generate 6 data points (representing quarters or bi-monthly)
    const data: number[] = [];
    let currentRevenue = investmentAmount * initialRevenuePercent;

    for (let i = 0; i < 6; i++) {
        // S-curve growth pattern - slower start, acceleration, then plateau
        const growthMultiplier = i < 2 ? 0.7 : i < 4 ? 1.0 : 0.85;
        const quarterGrowth = Math.pow(1 + monthlyGrowthRate * growthMultiplier, 2); // 2 months per point

        // Add realistic variation (±5%)
        const variation = 0.95 + ((seed + i * 17) % 100) / 1000;
        data.push(Math.round(currentRevenue * variation));
        currentRevenue *= quarterGrowth;
    }

    return data;
};

const SparklineChart: React.FC<SparklineChartProps> = ({
    data,
    width = 120,
    height = 40,
    color = '#6366f1',
    showArea = true,
    className = ''
}) => {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Calculate points for the polyline
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    // Calculate path for the area fill
    const areaPath = `
        M 0,${height}
        L ${data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' L ')}
        L ${width},${height}
        Z
    `;

    // Calculate percentage change
    const change = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(0);
    const isPositive = parseInt(change) >= 0;

    return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
            <motion.svg
                width={width}
                height={height}
                className="overflow-visible"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ originX: 0 }}
            >
                {/* Gradient definition */}
                <defs>
                    <linearGradient id={`sparkGradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area fill */}
                {showArea && (
                    <motion.path
                        d={areaPath}
                        fill={`url(#sparkGradient-${color.replace('#', '')})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    />
                )}

                {/* Line */}
                <motion.polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />

                {/* End dot */}
                <motion.circle
                    cx={(data.length - 1) / (data.length - 1) * width}
                    cy={height - ((data[data.length - 1] - min) / range) * height}
                    r="3"
                    fill={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                />
            </motion.svg>

            {/* Growth indicator */}
            <div className={`text-[10px] font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '↑' : '↓'} {Math.abs(parseInt(change))}% projected
            </div>
        </div>
    );
};

export default SparklineChart;
