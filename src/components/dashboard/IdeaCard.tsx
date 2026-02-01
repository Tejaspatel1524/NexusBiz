import React from 'react';
import { Briefcase, DollarSign, Clock, ArrowRight, TrendingUp, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BusinessIdea } from '../../types';
import { cn } from '../common/Button';
import { useSavedIdeasStore } from '../../store/useSavedIdeasStore';

interface IdeaCardProps {
    idea: BusinessIdea;
    onViewPlan: () => void;
    className?: string;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onViewPlan, className }) => {
    const { saveIdea, unsaveIdea, isIdeaSaved } = useSavedIdeasStore();
    const isSaved = isIdeaSaved(idea.id);

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

    return (
        <div className={cn(
            "liquid-glass p-8 flex flex-col h-full group relative overflow-hidden",
            className
        )}>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase size={120} />
            </div>

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

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 pr-12">
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest"
                        style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        {idea.industry}
                    </span>
                    <div className="flex items-center text-green-400 text-[10px] font-bold uppercase tracking-widest">
                        <TrendingUp size={12} className="mr-1" /> Score: {idea.difficultyScore}/10
                    </div>
                </div>

                <h3 className="text-2xl font-black tracking-tight mb-4 text-theme-primary group-hover:text-indigo-400 transition-colors duration-300">
                    {idea.title}
                </h3>

                <p className="text-theme-secondary text-sm leading-relaxed mb-8 line-clamp-3">
                    {idea.description}
                </p>
            </div>

            <div className="mt-auto space-y-6 relative z-10">
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
                    className="liquid-btn w-full py-4 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Synthesize Plan <ArrowRight size={16} />
                </motion.button>
            </div>
        </div>
    );
};

export default IdeaCard;
