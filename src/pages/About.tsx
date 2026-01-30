import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Shield, Users, Zap, Globe } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        icon: Lightbulb,
        title: 'AI-Powered Ideas',
        description: 'Our local AI engine generates innovative business ideas tailored to your skills, budget, and market conditions.',
    },
    {
        icon: Target,
        title: 'Market Analysis',
        description: 'Get comprehensive market research, competitor analysis, and customer persona development.',
    },
    {
        icon: Shield,
        title: 'Privacy First',
        description: 'All AI processing happens locally on your machine. Your business ideas never leave your computer.',
    },
    {
        icon: Zap,
        title: 'Instant Results',
        description: 'Generate complete business plans in minutes, not weeks. From idea to execution roadmap.',
    },
    {
        icon: Users,
        title: 'Built for Entrepreneurs',
        description: 'Designed by entrepreneurs, for entrepreneurs. We understand the challenges of starting a business.',
    },
    {
        icon: Globe,
        title: 'Global Insights',
        description: 'Location-aware analysis that considers local regulations, market conditions, and cultural factors.',
    },
];

const team = [
    { name: 'AI Strategy Engine', role: 'Business Intelligence', description: 'Powered by advanced local LLMs' },
    { name: 'Market Analyzer', role: 'Research & Insights', description: 'Real-time market data processing' },
    { name: 'Financial Modeler', role: 'Projections & Planning', description: 'Conservative, realistic forecasts' },
];

const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-32 pb-20">
            {/* Hero Section */}
            <section className="geometric-grid pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Turning <span className="text-blue">Ideas</span> Into{' '}
                            <span className="text-blue">Businesses</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            NexusBiz is an AI-powered business idea generator that helps entrepreneurs
                            discover, validate, and launch profitable ventures using cutting-edge local AI technology.
                        </p>
                        <Button onClick={() => navigate('/generator')} className="px-8">
                            Start Building Your Future
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-500/20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
                                Our <span className="text-blue">Mission</span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-4">
                                We believe that everyone has the potential to be an entrepreneur.
                                The biggest barrier? Knowing where to start.
                            </p>
                            <p className="text-gray-300 text-lg mb-4">
                                NexusBiz eliminates that barrier by combining your unique skills, resources,
                                and market conditions to generate actionable business ideas with complete
                                execution roadmaps.
                            </p>
                            <p className="text-gray-300 text-lg">
                                Our AI runs entirely on your local machine, ensuring your brilliant ideas
                                stay private and secure.
                            </p>
                        </div>
                        <div className="bg-black border border-gray-400 p-8">
                            <div className="text-6xl font-black text-blue mb-4">100%</div>
                            <div className="text-xl font-bold uppercase tracking-tight mb-2">Local & Private</div>
                            <p className="text-gray-400">
                                All AI processing happens on your machine. Your data never leaves your computer.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center mb-16"
                    >
                        Why Choose <span className="text-blue">NexusBiz</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-black border border-gray-400 p-6 hover:border-blue transition-colors"
                            >
                                <div className="w-12 h-12 bg-blue/20 flex items-center justify-center mb-4">
                                    <feature.icon size={24} className="text-blue" />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-tight mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="py-20 bg-gray-500/20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center mb-16"
                    >
                        Powered By <span className="text-blue">AI</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-blue mx-auto mb-4 flex items-center justify-center">
                                    <Zap size={32} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-blue text-sm font-bold uppercase tracking-wider mb-2">
                                    {member.role}
                                </p>
                                <p className="text-gray-400 text-sm">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
                            Ready to Start Your <span className="text-blue">Journey</span>?
                        </h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Join thousands of entrepreneurs who've discovered their next big idea with NexusBiz.
                        </p>
                        <Button onClick={() => navigate('/generator')} className="px-12">
                            Generate Your First Idea
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
