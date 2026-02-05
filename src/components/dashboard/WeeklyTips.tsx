import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, X, RefreshCw, Bookmark, Share2 } from 'lucide-react';

interface WeeklyTip {
    id: string;
    title: string;
    content: string;
    category: 'growth' | 'marketing' | 'finance' | 'operations' | 'mindset';
    actionUrl?: string;
}

interface WeeklyTipsProps {
    className?: string;
}

// Weekly tips pool - rotates based on week number
const TIPS_POOL: WeeklyTip[] = [
    { id: '1', title: 'Validate Before You Build', content: 'Before writing a single line of code, talk to 10 potential customers. Ask about their pain points, not your solution.', category: 'growth' },
    { id: '2', title: 'The Rule of 3', content: 'Focus on only 3 features for your MVP. More features = more complexity = slower launch.', category: 'operations' },
    { id: '3', title: "Price Higher Than You Think", content: "Most first-time founders underprice. Start at 2x what feels comfortable - you can always lower, rarely raise.", category: 'finance' },
    { id: '4', title: 'Build in Public', content: 'Share your journey on Twitter/LinkedIn. It builds an audience before launch and creates accountability.', category: 'marketing' },
    { id: '5', title: 'The 10-3-1 Rule', content: 'For every 10 leads, expect 3 demos and 1 sale. Use this to reverse-engineer your outreach volume.', category: 'growth' },
    { id: '6', title: 'Cash is King', content: 'Keep 6 months of runway in reserve. Revenue projections are optimistic 90% of the time.', category: 'finance' },
    { id: '7', title: 'Your First 10 Customers', content: 'Do things that don\'t scale. Personally onboard each customer. Learn everything you can.', category: 'growth' },
    { id: '8', title: 'Weekly Retros', content: 'Every Friday, ask: What worked? What didn\'t? What will I do differently next week?', category: 'mindset' },
    { id: '9', title: 'Content Compounds', content: 'One blog post per week = 52 assets per year. SEO takes time but pays dividends.', category: 'marketing' },
    { id: '10', title: 'Automate the Boring Stuff', content: 'If you do something more than 3 times, automate it. Your time is your most valuable asset.', category: 'operations' }
];

const categoryColors = {
    growth: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
    marketing: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    finance: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    operations: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
    mindset: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' }
};

const WeeklyTips: React.FC<WeeklyTipsProps> = ({ className = '' }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [currentTip, setCurrentTip] = useState<WeeklyTip | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    // Get tip based on current week
    useEffect(() => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        const tipIndex = weekNumber % TIPS_POOL.length;
        setCurrentTip(TIPS_POOL[tipIndex]);

        // Check if dismissed this week
        const dismissedWeek = localStorage.getItem('nexusbiz_tip_dismissed_week');
        if (dismissedWeek === weekNumber.toString()) {
            setIsVisible(false);
        }
    }, []);

    const dismissTip = () => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        localStorage.setItem('nexusbiz_tip_dismissed_week', weekNumber.toString());
        setIsVisible(false);
    };

    const getNextTip = () => {
        const currentIndex = TIPS_POOL.findIndex(t => t.id === currentTip?.id);
        const nextIndex = (currentIndex + 1) % TIPS_POOL.length;
        setCurrentTip(TIPS_POOL[nextIndex]);
    };

    const saveTip = () => {
        // In a real app, this would save to a database
        setIsSaved(!isSaved);
    };

    const shareTip = () => {
        if (navigator.share && currentTip) {
            navigator.share({
                title: `NexusBiz Tip: ${currentTip.title}`,
                text: currentTip.content,
                url: window.location.href
            });
        }
    };

    if (!isVisible || !currentTip) return null;

    const colors = categoryColors[currentTip.category];

    return (
        <AnimatePresence>
            <motion.div
                className={`liquid-glass overflow-hidden ${className}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
                {/* Header */}
                <div className="p-4 border-b border-theme flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                            <Lightbulb size={16} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-theme-primary">Weekly Tip</h3>
                            <p className="text-[10px] text-theme-muted">Fresh insights every week</p>
                        </div>
                    </div>
                    <button onClick={dismissTip} className="p-2 rounded-lg hover:bg-theme-tertiary transition-colors">
                        <X size={14} className="text-theme-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${colors.bg} ${colors.text}`}>
                        {currentTip.category}
                    </div>
                    <h4 className="text-lg font-bold text-theme-primary mb-2">{currentTip.title}</h4>
                    <p className="text-sm text-theme-secondary leading-relaxed">{currentTip.content}</p>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={saveTip}
                            className={`p-2 rounded-lg transition-colors ${isSaved ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-theme-tertiary text-theme-muted'}`}
                        >
                            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={shareTip} className="p-2 rounded-lg hover:bg-theme-tertiary text-theme-muted transition-colors">
                            <Share2 size={16} />
                        </button>
                        <button onClick={getNextTip} className="p-2 rounded-lg hover:bg-theme-tertiary text-theme-muted transition-colors">
                            <RefreshCw size={16} />
                        </button>
                    </div>
                    <button
                        onClick={() => window.open('/generator', '_self')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                    >
                        Apply Now <ChevronRight size={14} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WeeklyTips;
