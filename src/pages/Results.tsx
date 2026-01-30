import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, RotateCcw, LayoutGrid, List } from 'lucide-react';
import { useBusinessStore } from '../store/useBusinessStore';
import IdeaCard from '../components/dashboard/IdeaCard';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import Modal from '../components/common/Modal';

const Results: React.FC = () => {
    const navigate = useNavigate();
    const { generatedIdeas, isLoading, setSelectedPlan } = useBusinessStore();
    const [sortBy, setSortBy] = useState('relevance');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return <LoadingState />;
    }

    const handleTranslateToPlan = (idea: any) => {
        // Mocking the detailed plan data conversion
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
        <div className="min-h-screen pt-32 pb-20 bg-black">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="border-l-4 border-blue pl-6">
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Architectural Results</h1>
                        <p className="text-gray-200">Generated architectures based on your strategic inputs.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex bg-gray-500 border border-gray-400 p-1">
                            <button className="px-3 py-1.5 bg-blue text-white"><LayoutGrid size={16} /></button>
                            <button className="px-3 py-1.5 text-gray-200 hover:text-white"><List size={16} /></button>
                        </div>

                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-500 border border-gray-400 text-xs font-bold uppercase tracking-widest px-8 py-2.5 appearance-none focus:outline-none focus:border-blue"
                            >
                                <option value="relevance">By Relevance</option>
                                <option value="investment">By Investment</option>
                                <option value="difficulty">By Difficulty</option>
                            </select>
                            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
                        </div>

                        <Button variant="outline" size="sm" onClick={() => navigate('/generator')}>
                            <RotateCcw className="mr-2" size={14} /> Re-Calculate
                        </Button>
                    </div>
                </div>

                {/* Results Grid */}
                {generatedIdeas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {generatedIdeas.map((idea) => (
                            <IdeaCard
                                key={idea.id}
                                idea={idea}
                                onViewPlan={() => handleTranslateToPlan(idea)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center border border-dashed border-gray-400">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-200 mb-6">No architectures found</h2>
                        <Button onClick={() => navigate('/generator')}>Return to Generator</Button>
                    </div>
                )}

                {/* Comparison Table Placeholder */}
                <section className="mt-24 border-t border-gray-400 pt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Metric Comparison</h2>
                        <p className="text-gray-200">Side-by-side technical evaluation of generated concepts.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-gray-500 border border-gray-400 text-left">
                            <thead>
                                <tr className="bg-gray-400">
                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest border border-gray-400">Metric</th>
                                    {generatedIdeas.map(idea => (
                                        <th key={idea.id} className="p-4 text-[10px] font-black uppercase tracking-widest border border-gray-400 text-blue">
                                            {idea.title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 text-[10px] font-bold uppercase tracking-widest border border-gray-400">Difficulty</td>
                                    {generatedIdeas.map(idea => (
                                        <td key={idea.id} className="p-4 text-sm font-bold border border-gray-400">{idea.difficultyScore}/10</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-4 text-[10px] font-bold uppercase tracking-widest border border-gray-400">Investment</td>
                                    {generatedIdeas.map(idea => (
                                        <td key={idea.id} className="p-4 text-sm font-bold border border-gray-400">{idea.investmentNeeded}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-4 text-[10px] font-bold uppercase tracking-widest border border-gray-400">ROI Potential</td>
                                    {generatedIdeas.map(idea => (
                                        <td key={idea.id} className="p-4 text-sm font-bold border border-gray-400">{idea.potentialROI}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Save/Download Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Archive Selection"
                    footer={
                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button onClick={() => setIsModalOpen(false)}>Confirm Archive</Button>
                        </div>
                    }
                >
                    <div className="space-y-4">
                        <p className="text-gray-200 text-sm">
                            Select the archival format for the generated business architecture.
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="flex items-center justify-between p-4 bg-gray-400 border border-gray-300 hover:border-blue transition-colors">
                                <span className="text-xs font-black uppercase tracking-widest">Digital PDF Strategy</span>
                                <span className="text-[10px] text-gray-200">Recommended</span>
                            </button>
                            <button className="flex items-center justify-between p-4 bg-gray-400 border border-gray-300 hover:border-blue transition-colors">
                                <span className="text-xs font-black uppercase tracking-widest">Structured JSON Data</span>
                                <span className="text-[10px] text-gray-200">API Compatible</span>
                            </button>
                            <button className="flex items-center justify-between p-4 bg-gray-400 border border-gray-300 hover:border-blue transition-colors">
                                <span className="text-xs font-black uppercase tracking-widest">Enterprise CSV Model</span>
                                <span className="text-[10px] text-gray-200">Spreadsheet Optimized</span>
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Results;
