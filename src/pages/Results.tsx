import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, RotateCcw, LayoutGrid, List, BarChart3, PieChart, Activity } from 'lucide-react';
import { useBusinessStore } from '../store/useBusinessStore';
import IdeaCard from '../components/dashboard/IdeaCard';
import Button from '../components/common/Button';
import { PlanSkeleton } from '../components/common/Skeleton';
const Results: React.FC = () => {
    const navigate = useNavigate();
    const { generatedIdeas, isLoading, setSelectedPlan } = useBusinessStore();
    const [sortBy, setSortBy] = useState('relevance');

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-theme-primary">
                <div className="max-w-7xl mx-auto px-4">
                    <PlanSkeleton />
                </div>
            </div>
        );
    }

    const handleTranslateToPlan = (idea: any) => {
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
        <div className="min-h-screen pt-32 pb-20 bg-theme-primary transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 page-fade-in">
                    <div className="border-l-4 border-blue pl-8">
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
                            Strategic <span className="text-blue">Architectures</span>
                        </h1>
                        <p className="text-theme-secondary text-lg">AI-synthesized business concepts ready for deployment.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex glass p-1 rounded-lg">
                            <button className="px-3 py-1.5 bg-blue text-white rounded-md"><LayoutGrid size={16} /></button>
                            <button className="px-3 py-1.5 text-theme-secondary hover:text-theme-primary transition-colors"><List size={16} /></button>
                        </div>

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
                {generatedIdeas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8 auto-rows-[minmax(350px,auto)]">
                        {generatedIdeas.map((idea, index) => {
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

                        {/* Bento Statistics Card */}
                        <div className="md:col-span-3 lg:col-span-4 glass p-8 flex flex-col justify-between glass-hover page-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div>
                                <BarChart3 className="text-blue mb-6" size={32} />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-theme-muted mb-2">Market Sentiment</h3>
                                <div className="text-3xl font-black italic">Bullish Phase</div>
                            </div>
                            <div className="text-theme-muted text-xs leading-relaxed">
                                Current strategic alignment suggests a 82% success rate for high-innovation models.
                            </div>
                        </div>

                        <div className="md:col-span-3 lg:col-span-4 glass p-8 flex items-center justify-between glass-hover page-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-theme-muted mb-1">Generated Concepts</h3>
                                <div className="text-4xl font-black">{generatedIdeas.length}</div>
                            </div>
                            <div className="w-12 h-12 bg-blue/10 rounded-full flex items-center justify-center text-blue">
                                <Activity size={24} />
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
        </div>
    );
};

export default Results;
