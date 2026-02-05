import React, { useMemo } from 'react';
import { Briefcase, DollarSign, Clock, ArrowRight, Bookmark, TrendingUp, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BusinessIdea } from '../../types';
import { cn } from '../common/Button';
import { useSavedIdeasStore } from '../../store/useSavedIdeasStore';
import { useComparisonStore } from '../../store/useComparisonStore';
import SuccessScoreBadge, { calculateSuccessScore } from '../common/SuccessScoreBadge';
import SparklineChart, { generateRevenueData } from '../common/SparklineChart';

interface IdeaCardProps {
    idea: BusinessIdea;
    onViewPlan: () => void;
    className?: string;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onViewPlan, className }) => {
    const { saveIdea, unsaveIdea, isIdeaSaved } = useSavedIdeasStore();
    const { isCompareMode, toggleIdeaSelection, isIdeaSelected, selectedIdeas } = useComparisonStore();
    const isSaved = isIdeaSaved(idea.id);
    const isSelected = isIdeaSelected(idea.id);
    const canSelect = selectedIdeas.length < 3 || isSelected;

    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSaved) {
            unsaveIdea(idea.id);
        } else {
            saveIdea({
                id: idea.id,
                title: idea.title,
                description: idea.description,
                industry: idea.industry,
                investmentNeeded: idea.investmentNeeded,
                timeline: idea.timeline,
                savedAt: Date.now()
            });
        }
    };

    const successScore = calculateSuccessScore(
        idea.difficultyScore,
        idea.investmentNeeded,
        idea.timeline
    );

    return (
        <div
            className={cn(
                "liquid-glass p-8 flex flex-col h-full group relative overflow-hidden transition-all duration-300",
                isCompareMode && isSelected && "ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent",
                isCompareMode && !canSelect && "opacity-50",
                className
            )}
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase size={120} />
            </div>

            {/* Compare Mode Selection Checkbox */}
            {isCompareMode && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "absolute top-4 left-4 w-8 h-8 rounded-lg flex items-center justify-center z-20 cursor-pointer transition-all",
                        isSelected
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-theme-tertiary/80 text-theme-muted border border-theme hover:border-indigo-500"
                    )}
                >
                    {isSelected && <Check size={16} strokeWidth={3} />}
                </motion.div>
            )}

            {/* Bookmark Button */}
            <motion.button
                onClick={handleBookmark}
                className={cn(
                    "absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center z-20 transition-all",
                    isSaved
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                        : "bg-theme-tertiary/50 text-theme-muted hover:text-white hover:bg-theme-tertiary"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isSaved ? "Remove from saved" : "Save for later"}
            >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </motion.button>

            {/* Success Score Badge - positioned top right after bookmark */}
            <div className="absolute top-16 right-4 z-10">
                <SuccessScoreBadge
                    score={successScore}
                    size="md"
                    showLabel={true}
                />
            </div>

            <div className="relative z-10">
                <div className="flex items-center mb-4 pr-20">
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest"
                        style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        {idea.industry}
                    </span>
                </div>

                <h3 className="text-2xl font-black tracking-tight mb-4 text-theme-primary group-hover:text-indigo-400 transition-colors duration-300 pr-20">
                    {idea.title}
                </h3>

                <p className="text-theme-secondary text-sm leading-relaxed mb-8 line-clamp-3">
                    {idea.description}
                </p>
            </div>

            <div className="mt-auto space-y-6 relative z-10">
                {/* Mini Revenue Chart */}
                <div className="py-4 border-t border-theme">
                    <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center text-[10px] font-semibold uppercase tracking-widest text-theme-muted">
                            <TrendingUp size={12} className="mr-1" /> Revenue Projection
                        </span>
                    </div>
                    <SparklineChart
                        data={useMemo(() => generateRevenueData(idea.investmentNeeded, idea.timeline), [idea.investmentNeeded, idea.timeline])}
                        width={200}
                        height={45}
                        color="#6366f1"
                        showArea={true}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 py-6 border-y border-theme">
                    <div className="space-y-1">
                        <span className="flex items-center text-[10px] font-semibold uppercase tracking-widest text-theme-muted">
                            <DollarSign size={12} className="mr-1" /> Investment
                        </span>
                        <span className="text-sm font-bold text-theme-primary">{idea.investmentNeeded}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="flex items-center text-[10px] font-semibold uppercase tracking-widest text-theme-muted">
                            <Clock size={12} className="mr-1" /> Timeline
                        </span>
                        <span className="text-sm font-bold text-theme-primary">{idea.timeline}</span>
                    </div>
                </div>

                <motion.button
                    onClick={onViewPlan}
                    disabled={isCompareMode}
                    className={`liquid-btn w-full py-4 flex items-center justify-center gap-2 ${isCompareMode ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    whileHover={!isCompareMode ? { scale: 1.02 } : {}}
                    whileTap={!isCompareMode ? { scale: 0.98 } : {}}
                >
                    Synthesize Plan <ArrowRight size={16} />
                </motion.button>
            </div>

            {/* Selection Overlay for Compare Mode */}
            {isCompareMode && (
                <div
                    className="absolute inset-0 z-30 cursor-pointer flex items-center justify-center bg-black/20 backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        canSelect && toggleIdeaSelection(idea);
                    }}
                >
                    <div className={`px-6 py-3 rounded-xl font-bold text-white shadow-xl transform scale-110 ${isSelected ? 'bg-red-500' : 'bg-indigo-600'}`}>
                        {isSelected ? 'Deselect Idea' : 'Select to Compare'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdeaCard;

