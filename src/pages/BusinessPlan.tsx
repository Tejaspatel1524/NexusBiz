import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FileText,
    BarChart3,
    Target,
    TrendingUp,
    Shield,
    Download,
    ArrowLeft,
    Cpu,
    Truck,
    Gavel,
    History
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { useBusinessStore } from '../store/useBusinessStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const BusinessPlan: React.FC = () => {
    useParams();
    const navigate = useNavigate();
    const { selectedPlan } = useBusinessStore();
    const [activeTab, setActiveTab] = useState('summary');

    if (!selectedPlan) {
        return (
            <div className="pt-32 pb-20 text-center">
                <h2 className="text-2xl font-black uppercase mb-8">No Plan Data Found</h2>
                <Button onClick={() => navigate('/results')}>Return to Dashboard</Button>
            </div>
        );
    }

    const tabs = [
        { id: 'summary', label: 'Executive Summary', icon: FileText },
        { id: 'market', label: 'Market Analysis', icon: Target },
        { id: 'financials', label: 'Financial Projections', icon: TrendingUp },
        { id: 'marketing', label: 'Marketing Strategy', icon: BarChart3 },
        { id: 'operations', label: 'Operations & Logistics', icon: Truck },
        { id: 'tech', label: 'Technology', icon: Cpu },
        { id: 'legal', label: 'Legal & HR', icon: Gavel },
        { id: 'implementation', label: 'Timeline & Risk', icon: History },
    ];

    const chartData = selectedPlan.financialProjections.labels.map((label, index) => ({
        name: label,
        Year1: selectedPlan.financialProjections.yearOne[index],
        Year2: selectedPlan.financialProjections.yearTwo[index],
        Year3: selectedPlan.financialProjections.yearThree[index],
    }));

    return (
        <div className="min-h-screen pt-32 pb-20 bg-black">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="flex flex-col items-start gap-4">
                        <button
                            onClick={() => navigate('/results')}
                            className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-200 hover:text-blue transition-colors"
                        >
                            <ArrowLeft size={14} className="mr-1" /> Back to Dashboard
                        </button>
                        <div className="border-l-4 border-blue pl-6">
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">{selectedPlan.title}</h1>
                            <p className="text-gray-200">Comprehensive Architectural Specification</p>
                        </div>
                    </div>
                    <Button variant="outline" className="shrink-0 border-white hover:bg-white hover:text-black">
                        <Download size={18} className="mr-2" /> Export to PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Tabs Sidebar */}
                    <div className="lg:col-span-1 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center p-4 text-[10px] font-black uppercase tracking-widest transition-all duration-200 border-l ${activeTab === tab.id
                                    ? 'bg-blue text-white border-blue'
                                    : 'bg-gray-500 text-gray-200 border-gray-400 hover:bg-gray-400'
                                    }`}
                            >
                                <tab.icon size={16} className="mr-3" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <Card className="bg-black border border-gray-400 p-8 md:p-12 min-h-[600px] hover:translate-y-0" hover={false}>
                            {activeTab === 'summary' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Executive Summary</h2>
                                    <div className="w-16 h-1 bg-blue" />
                                    <p className="text-lg leading-relaxed text-gray-100 italic">
                                        {selectedPlan.executiveSummary}
                                    </p>
                                    <p className="text-gray-200 leading-relaxed">
                                        This strategic directive outlines the deployment of {selectedPlan.title}, a high-performance business unit designed to capture significant market share in the {selectedPlan.marketAnalysis.overview.split('market')[0]} sector through technical superiority and operational efficiency.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'market' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Market Analysis</h2>
                                    <div className="w-16 h-1 bg-blue" />
                                    <div className="space-y-6">
                                        <p className="text-gray-100">{selectedPlan.marketAnalysis.overview}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue mb-4">Market Trends</h4>
                                                <ul className="space-y-3">
                                                    {selectedPlan.marketAnalysis.trends.map((trend, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <span className="w-1.5 h-1.5 bg-blue shrink-0 mt-1.5 mr-3" />
                                                            <span className="text-sm text-gray-200">{trend}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue mb-4">Competitor Matrix</h4>
                                                <ul className="space-y-3">
                                                    {selectedPlan.marketAnalysis.competitors.map((comp, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <span className="w-1.5 h-1.5 bg-gray-200 shrink-0 mt-1.5 mr-3" />
                                                            <span className="text-sm text-gray-200">{comp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'financials' && (
                                <div className="space-y-12 animate-in fade-in duration-300">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Financial Projections</h2>
                                    <div className="w-16 h-1 bg-blue" />

                                    <div className="h-[400px] w-full bg-gray-500 p-4 border border-gray-400">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest mb-6">Revenue Growth Visualization (3-Year Forecast)</h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorY1" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                                                <XAxis dataKey="name" stroke="#808080" fontSize={10} tickLine={false} />
                                                <YAxis stroke="#808080" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #404040', fontSize: '12px' }}
                                                    itemStyle={{ color: '#FFFFFF' }}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase' }} />
                                                <Area type="monotone" dataKey="Year1" stroke="#0066FF" fillOpacity={1} fill="url(#colorY1)" />
                                                <Area type="monotone" dataKey="Year2" stroke="#66A3FF" fillOpacity={0.3} fill="#66A3FF" />
                                                <Area type="monotone" dataKey="Year3" stroke="#FFFFFF" fillOpacity={0.1} fill="#FFFFFF" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-4 bg-gray-500 border border-gray-400">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-200 mb-2">Breakeven Horizon</p>
                                            <p className="text-2xl font-black">14 Months</p>
                                        </div>
                                        <div className="p-4 bg-gray-500 border border-gray-400">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-200 mb-2">Init Capital Requirement</p>
                                            <p className="text-2xl font-black">$250,000</p>
                                        </div>
                                        <div className="p-4 bg-gray-500 border border-gray-400">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-200 mb-2">Est. Market Valuation (Y3)</p>
                                            <p className="text-2xl font-black text-blue">$14.2M</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'marketing' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Marketing Strategy</h2>
                                    <div className="w-16 h-1 bg-blue" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {selectedPlan.marketingStrategy.map((item, i) => (
                                            <div key={i} className="p-6 border border-gray-400 bg-gray-500 flex flex-col items-center text-center">
                                                <Target className="text-blue mb-4" size={32} />
                                                <p className="text-sm font-bold leading-relaxed">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tech' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Technology Stack</h2>
                                    <div className="w-16 h-1 bg-blue" />
                                    <div className="space-y-4">
                                        {selectedPlan.technologyRequirements.map((req, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-500 border border-gray-400">
                                                <div className="flex items-center space-x-4">
                                                    <Cpu className="text-blue" size={20} />
                                                    <span className="font-bold uppercase tracking-widest text-sm">{req}</span>
                                                </div>
                                                <span className="px-3 py-1 bg-gray-400 text-[10px] font-black uppercase">Critical Architecture</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'implementation' && (
                                <div className="space-y-12 animate-in fade-in duration-300">
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Implementation Timeline</h2>
                                        <div className="space-y-6">
                                            {selectedPlan.implementationTimeline.map((item, i) => (
                                                <div key={i} className="relative pl-10 border-l border-gray-300 pb-8 last:pb-0">
                                                    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 bg-blue border-4 border-black" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue">{item.date}</p>
                                                    <h4 className="text-lg font-bold uppercase tracking-tight">{item.milestone}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-12 border-t border-gray-400">
                                        <h3 className="text-xl font-black uppercase mb-6">Risk Mitigation Protocol</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {selectedPlan.riskAnalysis.map((risk, i) => (
                                                <div key={i} className="p-6 bg-red-500/5 border border-red-500/20">
                                                    <div className="flex items-center text-xs font-black uppercase tracking-widest text-red-500 mb-2">
                                                        <Shield size={14} className="mr-2" /> Risk Profile #{i + 1}
                                                    </div>
                                                    <h4 className="font-bold mb-3">{risk.risk}</h4>
                                                    <p className="text-gray-200 text-sm leading-relaxed">
                                                        <span className="font-black text-blue uppercase text-[10px]">Mitigation:</span> {risk.mitigation}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Default fallbacks for other tabs */}
                            {['operations', 'legal'].includes(activeTab) && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                                        {activeTab === 'operations' ? 'Operations & Logistics' : 'Legal & HR Structure'}
                                    </h2>
                                    <div className="w-16 h-1 bg-blue" />
                                    <p className="text-gray-200 leading-relaxed">
                                        {activeTab === 'operations' ? selectedPlan.productionLogistics : selectedPlan.legalCompliance}
                                    </p>
                                    <p className="text-gray-200 leading-relaxed">
                                        {activeTab === 'operations' ? selectedPlan.operationsPlan : selectedPlan.hrTeamStructure}
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPlan;
