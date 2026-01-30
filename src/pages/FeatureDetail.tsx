import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Zap,
    FileText,
    TrendingUp,
    Target,
    ClipboardCheck,
    Loader2,
    AlertCircle,
    RefreshCw,
    Sparkles,
    Brain
} from 'lucide-react';
import api from '../utils/api';
import { useBusinessStore } from '../store/useBusinessStore';

// Feature configuration with enhanced prompts
const featureConfig = {
    'ai-powered-ideas': {
        title: 'AI-Powered Business Ideas',
        description: 'Get innovative business ideas tailored to your expertise and market opportunities.',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500'
    },
    'complete-business-plans': {
        title: 'Complete Business Plans',
        description: 'Generate comprehensive business plans with all essential sections.',
        icon: FileText,
        color: 'from-blue-500 to-cyan-500'
    },
    'financial-projections': {
        title: 'Financial Projections',
        description: 'Get detailed 3-year financial forecasts and metrics.',
        icon: TrendingUp,
        color: 'from-green-500 to-emerald-500'
    },
    'marketing-strategy': {
        title: 'Marketing Strategy',
        description: 'Develop comprehensive marketing plans with actionable tactics.',
        icon: Target,
        color: 'from-purple-500 to-pink-500'
    },
    'operations-planning': {
        title: 'Operations Planning',
        description: 'Plan your daily operations, team structure, and growth roadmap.',
        icon: ClipboardCheck,
        color: 'from-red-500 to-rose-500'
    }
};

type FeatureId = keyof typeof featureConfig;

const FeatureDetail = () => {
    const { featureId } = useParams<{ featureId: string }>();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get business context from store
    const { generatedIdeas, selectedPlan, inputs } = useBusinessStore();

    const feature = featureId ? featureConfig[featureId as FeatureId] : null;

    // Get business context for personalized prompts
    const businessContext = useMemo(() => {
        if (generatedIdeas.length > 0) {
            const idea = generatedIdeas[0];
            return {
                title: idea.title,
                description: idea.description,
                industry: idea.industry || inputs.industry || 'general',
                budget: idea.estimatedBudget || inputs.budget || '$10,000'
            };
        }
        if (selectedPlan) {
            return {
                title: selectedPlan.title,
                description: selectedPlan.description,
                industry: selectedPlan.industry || inputs.industry || 'general',
                budget: inputs.budget || '$10,000'
            };
        }
        return null;
    }, [generatedIdeas, selectedPlan, inputs]);

    // Generate context-aware prompts - COMPREHENSIVE
    const getPrompt = (featureType: string): string => {
        if (businessContext) {
            const { title, description, industry, budget } = businessContext;

            switch (featureType) {
                case 'ai-powered-ideas':
                    return `You are an expert business strategist. Based on the business "${title}" in ${industry}: "${description}", generate 5 comprehensive related business ideas. For EACH idea provide: **Business Name**, **Detailed Description** (3-4 sentences), **Value Proposition**, **Target Market** (demographics and size), **Revenue Model**, **Startup Cost Breakdown** (itemized), **Monthly Revenue Potential** (with growth), **Competitive Advantage**, and **90-Day Launch Plan**. Be thorough and specific.`;

                case 'complete-business-plans':
                    return `Create a COMPREHENSIVE business plan for "${title}" - ${description}. Industry: ${industry}, Budget: ${budget}. Include ALL these sections in detail: **Executive Summary** (mission, vision, key success factors), **Market Analysis** (target market size, 5 competitors, positioning), **Products/Services** (offerings, pricing, unique features), **Marketing Strategy** (channels, 12-month calendar, customer acquisition), **Operations Plan** (processes, technology, QC), **Team Structure** (roles, hiring plan), **Financial Projections** (3-year forecast, break-even), **Risk Analysis** (top 5 risks with mitigation), **Implementation Timeline** (monthly milestones for year 1). Be specific with numbers and dates.`;

                case 'financial-projections':
                    return `Create DETAILED 3-year financial projections for "${title}" in ${industry}. Budget: ${budget}. Include: **Year 1 Monthly Breakdown** (revenue streams, operating expenses, cash flow, net profit), **Year 2-3 Quarterly** (revenue growth, scaling costs, profitability), **Key Metrics** (CAC, LTV, MRR, gross/net margins, burn rate), **Break-Even Analysis** (fixed vs variable costs, sensitivity analysis), **Funding Requirements** (current needs, future rounds, investor ROI), **Assumptions** (market growth, churn rate, pricing, cost inflation). Use realistic numbers with clear rationale.`;

                case 'marketing-strategy':
                    return `Create a COMPREHENSIVE marketing strategy for "${title}" - ${description}. Industry: ${industry}. Include: **Brand Strategy** (positioning, voice, messaging framework), **Target Audience** (2-3 detailed personas with demographics, pain points, journey), **Digital Marketing** (SEO keywords, content plan, social by platform, email automation, paid ads), **Traditional Marketing** (PR, events, partnerships), **12-Month Calendar** (monthly campaigns, themes, budget), **Budget Breakdown** (by channel with expected ROI), **KPIs** (traffic, engagement, conversion, revenue attribution), **Competitive Positioning** (differentiators). Be specific with tactics and timelines.`;

                case 'operations-planning':
                    return `Create a COMPREHENSIVE operations plan for "${title}" in ${industry}. Include: **Operations Overview** (core processes, success factors), **Daily Workflow** (hour-by-hour breakdown with morning/core/QC/EOD phases), **Technology Stack** (each tool: purpose, cost, integrations - CRM, PM, Analytics, Automation), **Team Structure** (current roles, responsibilities, salary ranges), **3-Year Hiring Roadmap** (quarterly positions, training), **Vendor Management** (key partners, procurement, quality standards), **Quality Control** (checkpoints, feedback systems, improvement process), **Scalability Plan** (triggers, capacity planning, automation), **Risk Management** (operational risks, continuity plan, insurance), **Operational KPIs** (efficiency, cost per unit, satisfaction). Be specific with tools, costs, and timelines.`;

                default:
                    return `Provide detailed analysis for ${featureType}`;
            }
        }

        // Default prompts when no business context - ENHANCED
        const defaultPrompts: Record<string, string> = {
            'ai-powered-ideas': 'You are an expert business strategist. Generate 5 innovative business ideas for a solo entrepreneur with $10,000 budget. For EACH idea provide: **Business Name**, **Detailed Description** (3-4 sentences), **Value Proposition**, **Target Market** (demographics and size), **Revenue Model**, **Startup Cost Breakdown** (itemized), **Monthly Revenue Potential** (with growth), **Competitive Advantage**, and **90-Day Launch Plan**. Be thorough and specific.',
            'complete-business-plans': 'Create a COMPREHENSIVE business plan for a tech startup. Include ALL sections: **Executive Summary** (mission, vision, success factors), **Market Analysis** (target market size, 5 competitors, positioning), **Products/Services** (offerings, pricing, features), **Marketing Strategy** (channels, 12-month calendar), **Operations Plan** (processes, technology), **Team Structure** (roles, hiring plan), **3-Year Financial Projections** (with break-even), **Risk Analysis** (top 5 risks with mitigation), **Implementation Timeline** (monthly milestones). Be specific with numbers.',
            'financial-projections': 'Create DETAILED 3-year financial projections for a SaaS startup. Include: **Year 1 Monthly Breakdown** (revenue, expenses, cash flow, profit), **Year 2-3 Quarterly** (growth, scaling costs), **Key Metrics** (CAC, LTV, MRR, margins, burn rate), **Break-Even Analysis**, **Funding Requirements** (with investor ROI), **Assumptions** (market growth, churn, pricing). Use realistic numbers with rationale.',
            'marketing-strategy': 'Create a COMPREHENSIVE marketing strategy. Include: **Brand Strategy** (positioning, voice, messaging), **Target Audience** (2-3 personas with demographics, pain points), **Digital Marketing** (SEO, content, social, email, paid ads), **Traditional Marketing** (PR, events), **12-Month Calendar**, **Budget Breakdown** (by channel with ROI), **KPIs** (traffic, conversion, revenue), **Competitive Positioning**. Be specific with tactics and timelines.',
            'operations-planning': 'Create a COMPREHENSIVE operations plan for an e-commerce business. Include: **Operations Overview**, **Daily Workflow** (hour-by-hour), **Technology Stack** (each tool with purpose and cost), **Team Structure** (roles, salaries), **3-Year Hiring Roadmap**, **Vendor Management**, **Quality Control** (checkpoints, feedback), **Scalability Plan**, **Risk Management**, **Operational KPIs**. Be specific with tools, costs, and timelines.'
        };

        return defaultPrompts[featureType] || 'Provide detailed business analysis';
    };

    const generateContent = async () => {
        if (!feature || !featureId) return;

        setLoading(true);
        setError('');
        setContent('');

        try {
            const prompt = getPrompt(featureId);
            console.log('Generating AI content with prompt:', prompt.substring(0, 100) + '...');

            const response = await api.chat('feature-gen', prompt);

            if (response && response.length > 0) {
                setContent(response);
            } else {
                setError('AI returned empty response. Please ensure Ollama is running and try again.');
            }
        } catch (err: any) {
            console.error('Error generating content:', err);
            setError(`Failed to generate AI content: ${err.message || 'Connection error'}. Please ensure:\n1. Backend server is running on port 5000\n2. Ollama is running with a model (llama3.2 or mistral)\n3. Click "Retry" to try again`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (feature) {
            generateContent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [featureId]);

    if (!feature) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Feature Not Found</h2>
                    <p className="text-gray-400 mb-6">The feature you're looking for doesn't exist.</p>
                    <Link to="/" className="text-primary-400 hover:text-primary-300">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const IconComponent = feature.icon;

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.color}`}>
                            <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{feature.title}</h1>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    </div>

                    {/* Business Context Indicator */}
                    {businessContext && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 p-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl border border-primary-500/30"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-5 h-5 text-primary-400" />
                                <span className="text-primary-300 font-medium">Personalized for your business</span>
                            </div>
                            <p className="text-white font-semibold">{businessContext.title}</p>
                            <p className="text-gray-400 text-sm">{businessContext.industry} • {businessContext.budget}</p>
                        </motion.div>
                    )}

                    {!businessContext && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30"
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <span className="text-yellow-300">
                                    <Link to="/generator" className="underline hover:no-underline">Generate a business idea</Link>
                                    {' '}first to get personalized content!
                                </span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-dark-700 p-8"
                >
                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-accent-400" />
                                </div>
                            </div>
                            <p className="text-gray-400 mt-6 text-lg">Generating comprehensive AI content...</p>
                            <p className="text-gray-500 mt-2 text-sm">This may take 30-60 seconds for detailed responses</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">AI Generation Failed</h3>
                            <p className="text-gray-400 text-center max-w-md whitespace-pre-line mb-6">{error}</p>
                            <button
                                onClick={generateContent}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Retry Generation
                            </button>
                        </div>
                    )}

                    {/* Content Display */}
                    {content && !loading && !error && (
                        <div className="prose prose-invert prose-lg max-w-none">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-green-400">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="font-medium">AI-Generated Content</span>
                                </div>
                                <button
                                    onClick={generateContent}
                                    className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Regenerate
                                </button>
                            </div>
                            <div
                                className="whitespace-pre-wrap text-gray-300 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                        .replace(/##\s+(.*?)$/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
                                        .replace(/###\s+(.*?)$/gm, '<h3 class="text-xl font-semibold text-primary-300 mt-6 mb-3">$1</h3>')
                                        .replace(/\n/g, '<br />')
                                }}
                            />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default FeatureDetail;
