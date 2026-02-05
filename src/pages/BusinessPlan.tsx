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
    History,
    ListChecks
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
import { useSavedIdeasStore } from '../store/useSavedIdeasStore';
import Button from '../components/common/Button';
import { generateBusinessPlanPDF } from '../utils/pdfExport';
import RevenueSimulator from '../components/dashboard/RevenueSimulator';
import ActionChecklist from '../components/dashboard/ActionChecklist';
import ValidationCard from '../components/dashboard/ValidationCard';

const BusinessPlan: React.FC = () => {
    useParams();
    const navigate = useNavigate();
    const { selectedPlan } = useBusinessStore();
    const { toggleChecklistStep, getCompletedSteps } = useSavedIdeasStore();
    const [activeTab, setActiveTab] = useState('summary');

    if (!selectedPlan) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-theme-primary flex items-center justify-center">
                <div className="glass p-12 text-center max-w-lg rounded-2xl page-fade-in">
                    <History size={48} className="text-blue mx-auto mb-6 opacity-20" />
                    <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter">No Plan Data Found</h2>
                    <p className="text-theme-secondary mb-8">Archived plan data is missing from session memory.</p>
                    <Button onClick={() => navigate('/results')} className="w-full">Return to Dashboard</Button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'summary', label: 'Executive Summary', icon: FileText },
        { id: 'action', label: 'Action Plan', icon: ListChecks },
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
        <div className="min-h-screen pt-32 pb-20 bg-theme-primary transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6 page-fade-in">
                    <div className="flex flex-col items-start gap-4">
                        <button
                            onClick={() => navigate('/results')}
                            className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted hover:text-blue transition-all duration-300"
                        >
                            <ArrowLeft size={14} className="mr-2" /> Back to Dashboard
                        </button>
                        <div className="border-l-4 border-blue pl-8">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
                                {selectedPlan.title}
                            </h1>
                            <p className="text-theme-secondary text-lg flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue rounded-full"></span>
                                Comprehensive Architectural Specification
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="glass border-white/10 hover:bg-blue hover:text-white hover:border-blue px-8"
                        onClick={() => generateBusinessPlanPDF(selectedPlan)}
                    >
                        <Download size={18} className="mr-2" /> Export to PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Tabs Sidebar - Glassy Navigation */}
                    <div className="lg:col-span-1 space-y-2 page-fade-in">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center p-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-lg group ${activeTab === tab.id
                                    ? 'bg-blue text-white shadow-lg shadow-blue/20 translate-x-1'
                                    : 'glass text-theme-secondary hover:translate-x-1 hover:border-blue/30'
                                    }`}
                            >
                                <tab.icon size={16} className={activeTab === tab.id ? "mr-4" : "mr-4 text-theme-muted group-hover:text-blue"} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area - Large Glass Card */}
                    <div className="lg:col-span-3 page-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="glass rounded-2xl p-8 md:p-16 min-h-[700px] relative overflow-hidden backdrop-blur-3xl">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 -mr-32 -mt-32 rounded-full blur-3xl"></div>

                            {activeTab === 'summary' && (
                                <div className="space-y-12 relative z-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Executive Summary</h2>
                                        <div className="w-20 h-1.5 bg-blue rounded-full" />
                                    </div>
                                    <div className="p-8 bg-blue/5 border-l-4 border-blue rounded-r-xl">
                                        <p className="text-xl leading-relaxed text-theme-primary italic font-medium">
                                            "{selectedPlan.executiveSummary}"
                                        </p>
                                    </div>
                                    <p className="text-theme-secondary text-lg leading-relaxed">
                                        This strategic directive outlines the deployment of <span className="text-blue font-bold">{selectedPlan.title}</span>, a high-performance business unit designed to capture significant market share in the {selectedPlan.marketAnalysis.overview.split('market')[0]} sector through technical superiority and operational efficiency.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'action' && (
                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Action Plan</h2>
                                        <div className="w-20 h-1.5 bg-blue rounded-full" />
                                        <p className="text-theme-secondary">Your personalized roadmap with revenue projections and step-by-step checklist.</p>
                                    </div>

                                    {/* Revenue Simulator */}
                                    <RevenueSimulator
                                        investmentNeeded="$250,000"
                                        timeline="12 months"
                                    />

                                    {/* Action Checklist */}
                                    <ActionChecklist
                                        ideaId={selectedPlan.id}
                                        completedSteps={getCompletedSteps(selectedPlan.id)}
                                        onToggleStep={(stepId) => toggleChecklistStep(selectedPlan.id, stepId)}
                                    />

                                    {/* Validation Data */}
                                    <ValidationCard industry={selectedPlan.marketAnalysis.overview.split(' ')[0]} />
                                </div>
                            )}

                            {activeTab === 'market' && (
                                <div className="space-y-12 relative z-10 transition-all">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Market Analysis</h2>
                                        <div className="w-20 h-1.5 bg-blue rounded-full" />
                                    </div>
                                    <div className="space-y-10">
                                        <p className="text-theme-primary text-lg leading-relaxed">{selectedPlan.marketAnalysis.overview}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                                            <div className="glass p-8 rounded-xl bg-blue/[0.02]">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-blue mb-6 border-b border-blue/20 pb-2">Market Trends</h4>
                                                <ul className="space-y-4">
                                                    {selectedPlan.marketAnalysis.trends.map((trend, i) => (
                                                        <li key={i} className="flex items-start group">
                                                            <div className="w-2 h-2 bg-blue rounded-full shrink-0 mt-1.5 mr-4 ring-4 ring-blue/10 group-hover:scale-125 transition-transform" />
                                                            <span className="text-theme-secondary font-medium leading-relaxed">{trend}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="glass p-8 rounded-xl bg-white/[0.01]">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-theme-muted mb-6 border-b border-white/5 pb-2">Competitor Matrix</h4>
                                                <ul className="space-y-4">
                                                    {selectedPlan.marketAnalysis.competitors.map((comp, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <div className="w-2 h-2 bg-theme-muted rounded-full shrink-0 mt-1.5 mr-4 opacity-40" />
                                                            <span className="text-theme-secondary font-medium leading-relaxed">{comp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'financials' && (
                                <div className="space-y-12 relative z-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Financial Forecast</h2>
                                        <div className="w-20 h-1.5 bg-blue rounded-full" />
                                    </div>

                                    <div className="h-[450px] w-full glass p-8 rounded-2xl bg-blue/[0.01]">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-theme-muted">Revenue Growth (3-Year Technical Forecast)</h3>
                                        <ResponsiveContainer width="100%" height="80%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorY1" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.4} />
                                                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                        backdropFilter: 'blur(8px)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '12px',
                                                        fontSize: '12px'
                                                    }}
                                                    itemStyle={{ color: '#FFFFFF' }}
                                                />
                                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '11px', fontWeight: '900', letterSpacing: '1px' }} />
                                                <Area type="monotone" dataKey="Year1" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorY1)" />
                                                <Area type="monotone" dataKey="Year2" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                                                <Area type="monotone" dataKey="Year3" stroke="#cbd5e1" strokeWidth={1} fillOpacity={0.05} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="p-8 glass bg-white/[0.01] rounded-xl hover:bg-blue/[0.02] transition-colors">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted mb-3">Breakeven Horizon</p>
                                            <p className="text-3xl font-black italic">14 Months</p>
                                        </div>
                                        <div className="p-8 glass bg-white/[0.01] rounded-xl hover:bg-blue/[0.02] transition-colors">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted mb-3">CapEx Requirement</p>
                                            <p className="text-3xl font-black italic">$250,000</p>
                                        </div>
                                        <div className="p-8 glass bg-blue/[0.03] border-blue/10 rounded-xl">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue mb-3">Est. Valuation (Y3)</p>
                                            <p className="text-3xl font-black text-blue italic">$14.2M</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'marketing' && (
                                <div className="space-y-12 relative z-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Marketing Intelligence</h2>
                                        <div className="w-20 h-1.5 bg-blue rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {selectedPlan.marketingStrategy.map((item, i) => (
                                            <div key={i} className="p-8 glass rounded-2xl flex flex-col items-center text-center group hover:border-blue/30 transition-all duration-500">
                                                <div className="w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                    <Target className="text-blue" size={32} />
                                                </div>
                                                <p className="text-base font-bold leading-relaxed text-theme-primary">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tech' && (
                                <div className="space-y-12 relative z-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Technology Stack</h2>
                                        <div className="w-20 h-1.5 bg-blue rounded-full" />
                                    </div>
                                    <div className="space-y-4">
                                        {selectedPlan.technologyRequirements.map((req, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 glass rounded-xl group hover:bg-blue/[0.02] transition-all">
                                                <div className="flex items-center space-x-6">
                                                    <div className="p-3 bg-blue/10 rounded-lg group-hover:bg-blue text-blue group-hover:text-white transition-all">
                                                        <Cpu size={24} />
                                                    </div>
                                                    <span className="font-black text-lg uppercase tracking-widest">{req}</span>
                                                </div>
                                                <span className="hidden sm:inline-block px-4 py-1.5 bg-blue/10 text-blue text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    Strategic Infrastructure
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'implementation' && (
                                <div className="space-y-16 relative z-10">
                                    <div>
                                        <div className="space-y-4 mb-12">
                                            <h2 className="text-3xl font-black uppercase tracking-tighter">Launch Timeline</h2>
                                            <div className="w-20 h-1.5 bg-blue rounded-full" />
                                        </div>
                                        <div className="space-y-12 ml-6 border-l-2 border-blue/20">
                                            {selectedPlan.implementationTimeline.map((item, i) => (
                                                <div key={i} className="relative pl-12 pb-2 last:pb-0">
                                                    <div className="absolute left-0 top-0 -translate-x-1/2 w-6 h-6 bg-theme-primary border-4 border-blue rounded-full shadow-[0_0_15px_rgba(0,102,255,0.3)]" />
                                                    <div className="glass p-6 rounded-xl hover:translate-x-2 transition-transform cursor-default">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue mb-2">{item.date}</p>
                                                        <h4 className="text-xl font-bold uppercase tracking-tight">{item.milestone}</h4>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-16 border-t border-white/5">
                                        <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                            <Shield className="text-red-500" /> Hazard Mitigation Framework
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {selectedPlan.riskAnalysis.map((risk, i) => (
                                                <div key={i} className="p-8 glass border-red-500/10 bg-red-500/[0.01] rounded-2xl group hover:border-red-500/30 transition-all">
                                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-red-500 mb-4 opacity-60">
                                                        Threat Profile Vector #{i + 1}
                                                    </div>
                                                    <h4 className="text-lg font-black mb-4 uppercase tracking-tight group-hover:text-red-500 transition-colors">{risk.risk}</h4>
                                                    <div className="p-4 bg-blue/5 rounded-lg border-l-2 border-blue">
                                                        <p className="text-theme-secondary text-sm leading-relaxed">
                                                            <span className="font-bold text-blue tracking-widest text-[10px] uppercase block mb-1">Deterrence Strategy:</span> {risk.mitigation}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Default fallbacks for other tabs */}
                            {['operations', 'legal'].includes(activeTab) && (
                                <div className="space-y-12 relative z-10">
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">
                                            {activeTab === 'operations' ? 'Operational Logistics' : 'Strategic HR & Compliance'}
                                        </h2>
                                        <div className="w-20 h-1.5 bg-blue rounded-full" />
                                    </div>
                                    <div className="space-y-8">
                                        <div className="p-8 glass rounded-2xl bg-blue/[0.01]">
                                            <p className="text-xl text-theme-primary leading-relaxed font-medium">
                                                {activeTab === 'operations' ? selectedPlan.productionLogistics : selectedPlan.legalCompliance}
                                            </p>
                                        </div>
                                        <div className="p-8 glass rounded-2xl">
                                            <p className="text-lg text-theme-secondary leading-relaxed">
                                                {activeTab === 'operations' ? selectedPlan.operationsPlan : selectedPlan.hrTeamStructure}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPlan;
