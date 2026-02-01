import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, RotateCcw, LayoutGrid, List, PieChart, Activity, TrendingUp, GitCompare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusinessStore } from '../store/useBusinessStore';
import { useComparisonStore } from '../store/useComparisonStore';
import IdeaCard from '../components/dashboard/IdeaCard';
import ComparisonModal from '../components/dashboard/ComparisonModal';
import Button from '../components/common/Button';
import { PlanSkeleton } from '../components/common/Skeleton';
import AnimatedCounter from '../components/common/AnimatedCounter';
const Results: React.FC = () => {
    const navigate = useNavigate();
    const { generatedIdeas, isLoading, setSelectedPlan } = useBusinessStore();
    const { isCompareMode, toggleCompareMode, selectedIdeas, openModal, clearSelection } = useComparisonStore();
    const [sortBy, setSortBy] = useState('relevance');
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(() => {
        return !localStorage.getItem('nexusbiz_onboarding_complete');
    });
    const [currentTip, setCurrentTip] = useState(0);

    const onboardingTips = [
        { title: "Strategic Bento", text: "Your results are organized in a high-density Bento Grid for quick scanning." },
        { title: "Glass Architectures", text: "Cards use Glassmorphism for clarity and modern aesthetic depth." },
        { title: "Search & Filter", text: "Use the new real-time search to instantly find specific business concepts." }
    ];

    const completeOnboarding = () => {
        localStorage.setItem('nexusbiz_onboarding_complete', 'true');
        setShowOnboarding(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-theme-primary">
                <div className="max-w-7xl mx-auto px-4">
                    <PlanSkeleton />
                </div>
            </div>
        );
    }

    const filteredIdeas = generatedIdeas.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTranslateToPlan = (idea: any) => {
        // ... (existing logic)
        const mockPlan = {
            id: idea.id,
            title: idea.title,
            executiveSummary: `${idea.title} is a ${idea.description} This venture leverages modern architectural principles to disrupt the ${idea.industry} sector.`,
            marketAnalysis: {
                overview: `The ${idea.industry} market is currently undergoing a massive digital transformation, with an estimated CAGR of 12.4% over the next decade.`,
                trends: ['Rising demand for autonomous systems', 'Shift towards decentralized infrastructure', 'Increasing regulatory focus on sustainability'],
                competitors: ['Legacy Corp Inc.', 'Generic Solutions Ltd.', 'Traditional Industry Players']
            },
            marketingStrategy: [
                'Growth hacking via industrial partnerships',
                'Direct-to-enterprise strategic outreach',
                'Authority positioning through whitepapers and technical excellence'
            ],
            financialProjections: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
                yearOne: [100000, 150000, 220000, 310000, 450000, 600000],
                yearTwo: [650000, 800000, 1000000, 1300000, 1700000, 2200000],
                yearThree: [2500000, 3000000, 3800000, 4800000, 6000000, 8000000]
            },
            operationsPlan: 'Fully automated cloud-native infrastructure with 24/7 monitoring and response protocols.',
            productionLogistics: 'Just-in-time manufacturing protocols with integrated supply chain transparency.',
            legalCompliance: 'Cross-jurisdictional regulatory compliance framework with automated reporting.',
            hrTeamStructure: 'Lean core team with specialized external consultants for peak load management.',
            technologyRequirements: ['Quantum-resistant encryption', 'Edge computing nodes', 'AI-orchestration layer'],
            implementationTimeline: [
                { milestone: 'Prototype Development', date: 'Month 1-3' },
                { milestone: 'Beta Testing', date: 'Month 4-6' },
                { milestone: 'Market Entry', date: 'Month 7-9' },
                { milestone: 'Scale Operations', date: 'Month 10-12' }
            ],
            riskAnalysis: [
                { risk: 'Technological Obsolescence', mitigation: 'Continuous R&D and modular architecture' },
                { risk: 'Supply Chain Disruption', mitigation: 'Multi-vendor sourcing and buffer stock' }
            ]
        };

        setSelectedPlan(mockPlan);
        navigate(`/plan/${idea.id}`);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-theme-primary transition-colors duration-500 relative overflow-hidden">
            {/* Visual Background Accents */}
            <div className="bg-blob -top-20 -left-20 animate-pulse"></div>
            <div className="bg-blob bg-blob-purple bottom-40 -right-20"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 page-fade-in">
                    <div className="border-l-4 border-blue pl-8">
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
                            Strategic <span className="text-blue">Architectures</span>
                        </h1>
                        <p className="text-theme-secondary text-lg">AI-synthesized business concepts ready for deployment.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search Implementation */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Filter concepts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="glass pl-10 pr-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest w-64 focus:w-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue/30"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-blue transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            </div>
                        </div>

                        <div className="flex glass p-1 rounded-lg">
                            <button className="px-3 py-1.5 bg-blue text-white rounded-md"><LayoutGrid size={16} /></button>
                            <button className="px-3 py-1.5 text-theme-secondary hover:text-theme-primary transition-colors"><List size={16} /></button>
                        </div>

                        {/* Compare Mode Toggle */}
                        <motion.button
                            onClick={toggleCompareMode}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${isCompareMode
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                : 'glass text-theme-secondary hover:text-theme-primary'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <GitCompare size={16} />
                            {isCompareMode ? 'Exit Compare' : 'Compare'}
                        </motion.button>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="glass text-xs font-bold uppercase tracking-widest pl-10 pr-8 py-3 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue/50"
                            >
                                <option value="relevance">By Relevance</option>
                                <option value="investment">By Investment</option>
                                <option value="difficulty">By Difficulty</option>
                            </select>
                            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue" />
                        </div>

                        <Button variant="outline" className="border-blue/20 hover:bg-blue/10" onClick={() => navigate('/generator')}>
                            <RotateCcw className="mr-2" size={14} /> Re-Calculate
                        </Button>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                {filteredIdeas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8 auto-rows-[minmax(350px,auto)]">
                        {filteredIdeas.map((idea, index) => {
                            // Bento Logic: Different sizes based on index
                            let colSpan = "md:col-span-3 lg:col-span-4"; // Default
                            if (index === 0) colSpan = "md:col-span-6 lg:col-span-8"; // Big featured item
                            if (index === 1) colSpan = "md:col-span-3 lg:col-span-4";
                            if (index === 2) colSpan = "md:col-span-3 lg:col-span-4";
                            if (index === 3) colSpan = "md:col-span-3 lg:col-span-8"; // Wide item

                            return (
                                <IdeaCard
                                    key={idea.id}
                                    idea={idea}
                                    onViewPlan={() => handleTranslateToPlan(idea)}
                                    className={colSpan}
                                />
                            );
                        })}

                        {/* Bento Statistics Card - Market Sentiment */}
                        <div className="md:col-span-3 lg:col-span-4 liquid-glass p-8 flex flex-col justify-between" style={{ animationDelay: '0.2s' }}>
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
                                    <TrendingUp className="text-white" size={28} />
                                </div>
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-theme-muted mb-3">Market Sentiment</h3>
                                <div className="text-3xl font-black gradient-text">Bullish Phase</div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-theme">
                                <div className="flex items-center gap-2">
                                    <span className="text-theme-muted text-xs">Success Rate:</span>
                                    <span className="text-2xl font-bold text-green-400">
                                        <AnimatedCounter value={82} suffix="%" duration={1.5} />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Generated Concepts Counter */}
                        <div className="md:col-span-3 lg:col-span-4 liquid-glass p-8 flex items-center justify-between" style={{ animationDelay: '0.3s' }}>
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-theme-muted mb-2">Generated Concepts</h3>
                                <div className="text-5xl font-black gradient-text">
                                    <AnimatedCounter value={generatedIdeas.length} duration={1} />
                                </div>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Activity size={28} className="text-white" />
                            </div>
                        </div>

                        <div className="md:col-span-6 lg:col-span-4 glass p-8 flex flex-col justify-between glass-hover page-fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="flex justify-between items-start">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-theme-muted">Risk Profile</h3>
                                <PieChart className="text-blue" size={20} />
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-blue/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue w-2/3"></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span>Moderate Risk</span>
                                    <span className="text-blue">Optimized</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-32 text-center glass border-dashed rounded-2xl page-fade-in">
                        <h2 className="text-2xl font-black title-font uppercase tracking-widest text-theme-secondary mb-8">System standby: No architectures synthesized</h2>
                        <Button onClick={() => navigate('/generator')} className="px-10">Return to Strategic Intelligence Engine</Button>
                    </div>
                )}
            </div>

            {/* Onboarding Tour Overlay */}
            {showOnboarding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in">
                    <div className="glass max-w-md w-full p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue opacity-10 -mr-16 -mt-16 rotate-45" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue flex items-center justify-center text-white text-xs font-black">
                                    {currentTip + 1}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">
                                    {onboardingTips[currentTip].title}
                                </h3>
                            </div>

                            <p className="text-theme-secondary leading-relaxed mb-10">
                                {onboardingTips[currentTip].text}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    {onboardingTips.map((_, i) => (
                                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentTip ? 'w-8 bg-blue' : 'w-2 bg-theme-muted'}`} />
                                    ))}
                                </div>

                                {currentTip < onboardingTips.length - 1 ? (
                                    <Button onClick={() => setCurrentTip(prev => prev + 1)}>Next Aspect</Button>
                                ) : (
                                    <Button onClick={completeOnboarding}>Launch NexusBiz</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Comparison Floating Action Bar */}
            {/* Comparison Floating Action Bar */}
            <AnimatePresence>
                {isCompareMode && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-indigo-500/50 shadow-2xl shadow-indigo-500/20"
                    >
                        {selectedIdeas.length === 0 ? (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-theme-tertiary border-2 border-dashed border-theme-muted flex items-center justify-center text-theme-muted">
                                    <GitCompare size={14} />
                                </div>
                                <span className="text-sm font-medium text-theme-secondary">
                                    Select up to <span className="text-indigo-400 font-bold">3 ideas</span> to compare
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                                <div className="flex -space-x-2">
                                    {selectedIdeas.map((idea) => (
                                        <div key={idea.id} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold shadow-lg">
                                            {idea.title.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-medium">
                                    <span className="text-indigo-400 font-bold">{selectedIdeas.length}</span>/3 Selected
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pl-2">
                            {selectedIdeas.length > 0 && (
                                <button
                                    onClick={clearSelection}
                                    className="px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-medium transition-colors text-theme-muted hover:text-white"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={openModal}
                                disabled={selectedIdeas.length < 2}
                                className={`px-6 py-2 rounded-lg font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 ${selectedIdeas.length < 2 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105'
                                    }`}
                            >
                                Compare Now
                                {selectedIdeas.length >= 2 && <ArrowRight size={14} />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Modal */}
            <ComparisonModal />
        </div>
    );
};

export default Results;
