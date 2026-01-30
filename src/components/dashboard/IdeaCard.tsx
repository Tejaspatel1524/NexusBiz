import React from 'react';
import { Briefcase, DollarSign, Clock, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import type { BusinessIdea } from '../../types';

interface IdeaCardProps {
    idea: BusinessIdea;
    onViewPlan: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onViewPlan }) => {
    return (
        <Card className="flex flex-col h-full border-gray-400 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Briefcase size={80} />
            </div>

            <div className="mb-6">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue mb-2">
                    <span className="px-2 py-0.5 border border-blue">{idea.industry}</span>
                    <span>•</span>
                    <span>Score: {idea.difficultyScore}/10</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-blue transition-colors">
                    {idea.title}
                </h3>
                <p className="text-gray-100 text-sm leading-relaxed mb-8">
                    {idea.description}
                </p>
            </div>

            <div className="mt-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-200">
                            <DollarSign size={12} className="mr-1" /> Investment
                        </span>
                        <span className="text-sm font-bold">{idea.investmentNeeded}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-200">
                            <Clock size={12} className="mr-1" /> Timeline
                        </span>
                        <span className="text-sm font-bold">{idea.timeline}</span>
                    </div>
                </div>

                <Button
                    onClick={onViewPlan}
                    className="w-full mt-4 group/btn"
                >
                    View Full Plan <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                </Button>
            </div>
        </Card>
    );
};

export default IdeaCard;
