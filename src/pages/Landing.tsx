import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Zap,
    BarChart3,
    Target,
    Settings,
    ArrowRight,
    Globe,
    Briefcase
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            id: 'ai-powered-ideas',
            title: 'AI-Powered Ideas',
            description: 'Advanced algorithms curate personalized business concepts based on your market potential.',
            icon: Zap
        },
        {
            id: 'complete-business-plans',
            title: 'Complete Business Plans',
            description: 'Go from concept to execution with comprehensive structural frameworks and strategies.',
            icon: Target
        },
        {
            id: 'financial-projections',
            title: 'Financial Projections',
            description: 'Data-driven forecasting for revenue, expenses, and profitability over a 3-year horizon.',
            icon: BarChart3
        },
        {
            id: 'marketing-strategy',
            title: 'Marketing Strategy',
            description: 'Targeted customer acquisition plans and brand positioning for your specific industry.',
            icon: Globe
        },
        {
            id: 'operations-planning',
            title: 'Operations Planning',
            description: 'Detailed workflows and resource requirements to streamline your backend operations.',
            icon: Settings
        }
    ];

    const stats = [
        { label: 'Ideas Generated', value: '1.2M+' },
        { label: 'Businesses Launched', value: '45k+' },
        { label: 'Success Rate', value: '89%' },
        { label: 'Market Value', value: '$3.4B' }
    ];

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-gray-400 geometric-grid">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
                            GENERATE YOUR NEXT<br />
                            <span className="text-blue">BUSINESS EMPIRE</span>
                        </h1>
                        <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium tracking-wide">
                            The professional framework for architects of industry. Precision-engineered business concepts powered by strategic intelligence.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" onClick={() => navigate('/generator')} className="w-full sm:w-auto">
                                Start Generating <ArrowRight className="ml-2" size={18} />
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate('/feature/ai-powered-ideas')} className="w-full sm:w-auto">
                                View Sample Plans
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-1/4 left-10 w-20 h-20 border border-gray-400 opacity-20" />
                <div className="absolute bottom-1/4 right-10 w-32 h-32 border border-blue opacity-10" />
            </section>

            {/* Stats Section */}
            <section className="bg-gray-500 border-b border-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-200">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-16">
                        <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Strategic Features</h2>
                        <div className="w-20 h-1 bg-blue" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => navigate(`/feature/${feature.id}`)}
                                className="cursor-pointer"
                            >
                                <Card className="h-full border-gray-400 hover:border-blue group transition-all duration-300 hover:shadow-lg hover:shadow-blue/10">
                                    <div className="w-12 h-12 bg-gray-400 group-hover:bg-blue transition-colors flex items-center justify-center mb-6">
                                        <feature.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{feature.title}</h3>
                                    <p className="text-gray-200 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <div className="mt-4 flex items-center text-blue text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Explore Feature</span>
                                        <ArrowRight size={14} className="ml-2" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-gray-400">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase">Ready to dominate the market?</h2>
                    <p className="text-gray-200 mb-10 text-lg">
                        Join thousands of entrepreneurs using NexusBiz to structure their future.
                    </p>
                    <Button size="lg" onClick={() => navigate('/generator')} className="px-12">
                        Build Your Empire Now
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-500 border-t border-gray-400">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue flex items-center justify-center">
                            <Briefcase size={14} className="text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tighter uppercase">NexusBiz</span>
                    </div>
                    <div className="flex space-x-8">
                        <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-200 hover:text-white">Terms</a>
                        <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-200 hover:text-white">Privacy</a>
                        <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-200 hover:text-white">Contact</a>
                    </div>
                    <p className="text-xs text-gray-300">© 2026 NEXUSBIZ CORP. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
