import React from 'react';
import { Briefcase, DollarSign, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import Button from '../common/Button';
import type { BusinessIdea } from '../../types';
import { cn } from '../common/Button';

interface IdeaCardProps {
    idea: BusinessIdea;
    onViewPlan: () => void;
    className?: string;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onViewPlan, className }) => {
    return (
        <div className={cn(
            "glass p-8 flex flex-col h-full group relative overflow-hidden glass-hover page-fade-in",
            className
        )}>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue/10 text-blue text-[10px] font-black uppercase tracking-widest border border-blue/20 rounded-full">
                        {idea.industry}
                    </span>
                    <div className="flex items-center text-green-500 text-[10px] font-bold uppercase tracking-widest">
                        <TrendingUp size={12} className="mr-1" /> Score: {idea.difficultyScore}/10
                    </div>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-blue transition-colors duration-300">
                    {idea.title}
                </h3>

                <p className="text-theme-secondary text-sm leading-relaxed mb-8 line-clamp-3">
                    {idea.description}
                </p>
            </div>

            <div className="mt-auto space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5">
                    <div className="space-y-1">
                        <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-theme-muted">
                            <DollarSign size={12} className="mr-1" /> Investment
                        </span>
                        <span className="text-sm font-black text-theme-primary">{idea.investmentNeeded}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-theme-muted">
                            <Clock size={12} className="mr-1" /> Timeline
                        </span>
                        <span className="text-sm font-black text-theme-primary">{idea.timeline}</span>
                    </div>
                </div>

                <Button
                    onClick={onViewPlan}
                    className="w-full group/btn relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center">
                        Synthesize Plan <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default IdeaCard;
