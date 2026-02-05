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
    Briefcase,
    Sparkles
} from 'lucide-react';
import LiquidBackground from '../components/common/LiquidBackground';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            id: 'ai-powered-ideas',
            title: 'AI-Powered Ideas',
            description: 'Advanced algorithms curate personalized business concepts based on your market potential.',
            icon: Zap,
            gradient: 'from-indigo-500 to-purple-500'
        },
        {
            id: 'complete-business-plans',
            title: 'Complete Business Plans',
            description: 'Go from concept to execution with comprehensive structural frameworks and strategies.',
            icon: Target,
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            id: 'financial-projections',
            title: 'Financial Projections',
            description: 'Data-driven forecasting for revenue, expenses, and profitability over a 3-year horizon.',
            icon: BarChart3,
            gradient: 'from-cyan-500 to-blue-500'
        },
        {
            id: 'marketing-strategy',
            title: 'Marketing Strategy',
            description: 'Targeted customer acquisition plans and brand positioning for your specific industry.',
            icon: Globe,
            gradient: 'from-pink-500 to-orange-500'
        },
        {
            id: 'operations-planning',
            title: 'Operations Planning',
            description: 'Detailed workflows and resource requirements to streamline your backend operations.',
            icon: Settings,
            gradient: 'from-blue-500 to-indigo-500'
        }
    ];

    const stats = [
        { label: 'Ideas Generated', value: '1.2M+' },
        { label: 'Businesses Launched', value: '45k+' },
        { label: 'Success Rate', value: '89%' },
        { label: 'Market Value', value: '$3.4B' }
    ];

    // Industry verticals for focused messaging
    const verticals = [
        { name: 'SaaS & Tech', emoji: '💻', desc: 'Build the next unicorn startup', color: 'from-indigo-500 to-purple-500' },
        { name: 'E-Commerce', emoji: '🛒', desc: 'Launch your online empire', color: 'from-pink-500 to-orange-500' },
        { name: 'Health & Wellness', emoji: '🏥', desc: 'Innovate in healthcare', color: 'from-green-500 to-teal-500' },
        { name: 'FinTech', emoji: '💰', desc: 'Disrupt traditional finance', color: 'from-blue-500 to-cyan-500' },
        { name: 'EdTech', emoji: '📚', desc: 'Transform education', color: 'from-purple-500 to-pink-500' },
        { name: 'Sustainability', emoji: '🌱', desc: 'Build a greener future', color: 'from-emerald-500 to-green-500' }
    ];

    // Industry testimonials
    const testimonials = [
        { name: 'Sarah Chen', role: 'Founder, TechFlow', quote: 'NexusBiz helped me validate my SaaS idea in 2 days. The revenue projections were spot-on.', industry: 'SaaS', avatar: '👩‍💻' },
        { name: 'Marcus Rivera', role: 'CEO, ShopLocal', quote: "The action checklist kept me focused. Launched my e-commerce store in 6 weeks.", industry: 'E-Commerce', avatar: '👨‍💼' },
        { name: 'Dr. Priya Sharma', role: 'Founder, HealthBridge', quote: 'The market validation data gave me confidence to pursue my telehealth startup.', industry: 'HealthTech', avatar: '👩‍⚕️' }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Liquid Background */}
            <LiquidBackground />

            {/* Content Container */}
            <div className="relative z-10 pt-20">

                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center justify-center px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 liquid-glass-subtle"
                            >
                                <Sparkles size={14} className="text-purple-400" />
                                <span className="text-xs font-semibold text-theme-secondary">AI-Powered Business Intelligence</span>
                            </motion.div>

                            {/* Main Title */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[0.9]">
                                <span className="text-theme-primary">Build Your Next</span>
                                <br />
                                <span className="gradient-text">Business Empire</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-theme-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                                Transform ideas into actionable business plans. Powered by advanced AI
                                that understands markets, competition, and growth strategies.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <motion.button
                                    onClick={() => navigate('/generator')}
                                    className="liquid-btn flex items-center gap-2 text-base px-8 py-5"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Generating
                                    <ArrowRight size={18} />
                                </motion.button>
                                <motion.button
                                    onClick={() => navigate('/feature/ai-powered-ideas')}
                                    className="liquid-btn-secondary flex items-center gap-2 text-base px-8 py-5"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    View Sample Plans
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <motion.div
                            className="liquid-glass p-8 md:p-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="text-center"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <p className="text-4xl md:text-5xl font-black gradient-text mb-2">{stat.value}</p>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-theme-muted">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-theme-primary">
                                Strategic <span className="gradient-text">Features</span>
                            </h2>
                            <p className="text-theme-secondary max-w-xl mx-auto">
                                Everything you need to go from idea to execution
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    onClick={() => navigate(`/feature/${feature.id}`)}
                                    className="cursor-pointer group"
                                >
                                    <div className="liquid-glass p-8 h-full">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <feature.icon className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-theme-primary group-hover:text-indigo-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-theme-secondary text-sm leading-relaxed mb-4">
                                            {feature.description}
                                        </p>
                                        <div className="flex items-center text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span>Learn More</span>
                                            <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Industry Verticals Section */}
                <section className="relative py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-theme-primary">
                                Built for <span className="gradient-text">Every Industry</span>
                            </h2>
                            <p className="text-theme-secondary max-w-xl mx-auto">
                                Whether you're building a SaaS startup or launching an e-commerce store, we've got you covered.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {verticals.map((vertical, index) => (
                                <motion.div
                                    key={vertical.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    onClick={() => navigate('/generator')}
                                    className="cursor-pointer group"
                                >
                                    <div className="liquid-glass p-6 text-center h-full hover:scale-105 transition-transform">
                                        <div className="text-4xl mb-3">{vertical.emoji}</div>
                                        <h3 className="text-sm font-bold text-theme-primary mb-1 group-hover:text-indigo-400 transition-colors">
                                            {vertical.name}
                                        </h3>
                                        <p className="text-[10px] text-theme-muted">{vertical.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="relative py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-theme-primary">
                                Trusted by <span className="gradient-text">Founders</span>
                            </h2>
                            <p className="text-theme-secondary max-w-xl mx-auto">
                                See what entrepreneurs are saying about NexusBiz
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="liquid-glass p-8 h-full">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-theme-primary">{testimonial.name}</h4>
                                                <p className="text-xs text-theme-muted">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-theme-secondary text-sm leading-relaxed italic">
                                            "{testimonial.quote}"
                                        </p>
                                        <div className="mt-4 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400">
                                            {testimonial.industry}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-24 px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className="liquid-glass p-12 md:p-16 text-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-black mb-6 text-theme-primary">
                                Ready to <span className="gradient-text">Dominate</span> the Market?
                            </h2>
                            <p className="text-theme-secondary mb-10 text-lg max-w-xl mx-auto">
                                Join thousands of entrepreneurs using NexusBiz to structure and launch their future.
                            </p>
                            <motion.button
                                onClick={() => navigate('/generator')}
                                className="liquid-btn text-base px-12 py-5"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Build Your Empire Now
                            </motion.button>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative py-12 px-4 border-t border-theme">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'var(--gradient-primary)' }}
                            >
                                <Briefcase size={20} className="text-white" />
                            </div>
                            <span className="text-xl font-black text-theme-primary">NexusBiz</span>
                        </div>
                        <div className="flex gap-8">
                            <a href="#" className="text-sm font-medium text-theme-muted hover:text-theme-primary transition-colors">Terms</a>
                            <a href="#" className="text-sm font-medium text-theme-muted hover:text-theme-primary transition-colors">Privacy</a>
                            <a href="#" className="text-sm font-medium text-theme-muted hover:text-theme-primary transition-colors">Contact</a>
                        </div>
                        <p className="text-sm text-theme-muted">© 2026 NexusBiz. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
