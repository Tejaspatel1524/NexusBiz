import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SuccessScoreBadgeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

/**
 * Calculate success score based on idea parameters
 * @param difficultyScore - 1-10 score (higher = more viable)
 * @param investment - Investment string like "$10k-$50k"
 * @param timeline - Timeline string like "6 months"
 * @returns Score 0-100
 */
export const calculateSuccessScore = (
    difficultyScore: number,
    investment: string,
    timeline: string
): number => {
    let score = 0;

    // Viability score contributes 40% (difficultyScore is 1-10, treated as viability)
    score += (difficultyScore / 10) * 40;

    // Investment factor contributes 30%
    // Lower investment = higher score (easier to start)
    const investmentValue = parseInvestment(investment);
    if (investmentValue <= 10000) score += 30;
    else if (investmentValue <= 50000) score += 24;
    else if (investmentValue <= 100000) score += 18;
    else if (investmentValue <= 250000) score += 12;
    else score += 6;

    // Timeline factor contributes 30%
    // Shorter timeline = higher score (faster to market)
    const months = parseTimeline(timeline);
    if (months <= 3) score += 30;
    else if (months <= 6) score += 24;
    else if (months <= 12) score += 18;
    else if (months <= 18) score += 12;
    else score += 6;

    return Math.min(100, Math.round(score));
};

const parseInvestment = (investment: string): number => {
    const match = investment.match(/\$?([\d,]+)/);
    if (!match) return 50000; // default
    let value = parseInt(match[1].replace(/,/g, ''));
    if (investment.toLowerCase().includes('k')) value *= 1000;
    if (investment.toLowerCase().includes('m')) value *= 1000000;
    return value;
};

const parseTimeline = (timeline: string): number => {
    const match = timeline.match(/(\d+)/);
    if (!match) return 12; // default
    return parseInt(match[1]);
};

const getScoreColor = (score: number) => {
    if (score >= 75) return { bg: 'from-green-500 to-emerald-600', text: 'text-green-400', label: 'Excellent' };
    if (score >= 50) return { bg: 'from-amber-500 to-orange-600', text: 'text-amber-400', label: 'Good' };
    if (score >= 25) return { bg: 'from-orange-500 to-red-500', text: 'text-orange-400', label: 'Moderate' };
    return { bg: 'from-red-500 to-red-700', text: 'text-red-400', label: 'Challenging' };
};

const getScoreIcon = (score: number) => {
    if (score >= 60) return TrendingUp;
    if (score >= 40) return Minus;
    return TrendingDown;
};

const SuccessScoreBadge: React.FC<SuccessScoreBadgeProps> = ({
    score,
    size = 'md',
    showLabel = true
}) => {
    const { bg, text, label } = getScoreColor(score);
    const Icon = getScoreIcon(score);

    const sizes = {
        sm: { badge: 'w-10 h-10', text: 'text-sm', icon: 12 },
        md: { badge: 'w-14 h-14', text: 'text-lg', icon: 16 },
        lg: { badge: 'w-20 h-20', text: 'text-2xl', icon: 20 }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <motion.div
                className={`${sizes[size].badge} rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg relative overflow-hidden`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent" />

                <span className={`${sizes[size].text} font-black text-white relative z-10`}>
                    {score}
                </span>
            </motion.div>

            {showLabel && (
                <div className="flex items-center gap-1">
                    <Icon size={sizes[size].icon} className={text} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${text}`}>
                        {label}
                    </span>
                </div>
            )}
        </div>
    );
};

export default SuccessScoreBadge;
