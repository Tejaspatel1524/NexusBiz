import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Building, Wrench, Rocket, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

interface ChecklistStep {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    tips: string[];
}

interface ActionChecklistProps {
    ideaId: string;
    completedSteps: string[];
    onToggleStep: (stepId: string) => void;
    className?: string;
}

const CHECKLIST_STEPS: ChecklistStep[] = [
    { id: 'validate', title: 'Validate', description: 'Talk to 10+ potential customers to validate demand', icon: Target, tips: ['Find customers on LinkedIn, Reddit, or local communities', 'Ask about their pain points, not your solution', 'Document common patterns and objections'] },
    { id: 'register', title: 'Register', description: 'Set up your business entity and online presence', icon: Building, tips: ['Choose a business name and domain', 'Register as sole proprietor or LLC', 'Set up social media handles'] },
    { id: 'build', title: 'Build MVP', description: 'Create a minimum viable product to test with users', icon: Wrench, tips: ['Focus on ONE core feature that solves the problem', 'Use no-code tools if possible (Bubble, Webflow)', 'Get to market in 4-6 weeks maximum'] },
    { id: 'launch', title: 'Launch', description: 'Get your first 100 paying customers', icon: Rocket, tips: ['Launch on Product Hunt, Indie Hackers', 'Offer early-bird pricing or lifetime deals', 'Ask every customer for referrals'] },
    { id: 'scale', title: 'Scale', description: 'Grow revenue and expand your team', icon: TrendingUp, tips: ['Identify your best acquisition channel and double down', 'Hire for roles you spend >10 hours/week on', 'Reinvest 30-50% of profits into growth'] }
];

const ActionChecklist: React.FC<ActionChecklistProps> = ({ completedSteps, onToggleStep, className = '' }) => {
    const progressPercentage = (completedSteps.length / CHECKLIST_STEPS.length) * 100;

    return (
        <motion.div className={`liquid-glass overflow-hidden ${className}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="p-6 border-b border-theme">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-theme-primary">Action Checklist</h3>
                            <p className="text-xs text-theme-muted">Your roadmap from idea to business</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black gradient-text">{completedSteps.length}/{CHECKLIST_STEPS.length}</div>
                        <div className="text-[10px] text-theme-muted uppercase">Steps Done</div>
                    </div>
                </div>
                <div className="h-2 rounded-full bg-theme-tertiary/50 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: 'var(--gradient-primary)' }} initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                </div>
            </div>

            {/* Steps */}
            <div className="p-6 space-y-4">
                {CHECKLIST_STEPS.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isNext = !isCompleted && completedSteps.length === index;
                    const Icon = step.icon;

                    return (
                        <motion.div
                            key={step.id}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${isCompleted ? 'bg-green-500/10 border-green-500/30' : isNext ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-theme-tertiary/30 border-theme hover:border-theme-hover'}`}
                            onClick={() => onToggleStep(step.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500 text-white' : isNext ? 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500' : 'bg-theme-tertiary text-theme-muted border border-theme'}`}>
                                    {isCompleted ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{index + 1}</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon size={16} className={isCompleted ? 'text-green-400' : isNext ? 'text-indigo-400' : 'text-theme-muted'} />
                                        <h4 className={`font-bold ${isCompleted ? 'text-green-400 line-through' : 'text-theme-primary'}`}>{step.title}</h4>
                                        {isNext && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400">Next Step</span>}
                                    </div>
                                    <p className="text-sm text-theme-secondary mb-2">{step.description}</p>
                                    {isNext && (
                                        <motion.div className="mt-3 space-y-1" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                            {step.tips.map((tip, i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-theme-muted">
                                                    <ChevronRight size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                                                    <span>{tip}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {completedSteps.length === CHECKLIST_STEPS.length && (
                <motion.div className="p-6 border-t border-theme bg-gradient-to-r from-green-500/10 to-emerald-500/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-3 text-green-400">
                        <CheckCircle2 size={24} />
                        <div>
                            <div className="font-bold">Congratulations! 🎉</div>
                            <div className="text-sm text-green-400/70">You have completed all steps. Your business is live!</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ActionChecklist;
