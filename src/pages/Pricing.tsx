import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for exploring business ideas',
        icon: Zap,
        features: [
            '3 business ideas per month',
            'Basic market analysis',
            'Community support',
            'Export to PDF',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Professional',
        price: '$29',
        period: '/month',
        description: 'For serious entrepreneurs',
        icon: Crown,
        features: [
            'Unlimited business ideas',
            'Detailed market analysis',
            'Financial projections',
            'Marketing strategy',
            'Priority support',
            'AI chat assistant',
        ],
        cta: 'Start Free Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        description: 'For teams and agencies',
        icon: Rocket,
        features: [
            'Everything in Professional',
            'Team collaboration',
            'Custom integrations',
            'White-label reports',
            'Dedicated success manager',
            'API access',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
];

const Pricing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-32 pb-20 geometric-grid">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                        Simple, Transparent <span className="text-blue">Pricing</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Choose the plan that fits your entrepreneurial journey.
                        Start free, upgrade when you're ready.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative bg-black border ${plan.popular ? 'border-blue' : 'border-gray-400'
                                } p-8 flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue px-4 py-1 text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className={`w-12 h-12 ${plan.popular ? 'bg-blue' : 'bg-gray-500'} flex items-center justify-center mb-6`}>
                                <plan.icon size={24} className="text-white" />
                            </div>

                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                                {plan.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                            <div className="mb-8">
                                <span className="text-4xl font-black">{plan.price}</span>
                                {plan.period && (
                                    <span className="text-gray-400">{plan.period}</span>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check size={16} className="text-blue flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? 'primary' : 'outline'}
                                className="w-full justify-center"
                                onClick={() => navigate('/generator')}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-24 text-center"
                >
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
                        Questions?
                    </h2>
                    <p className="text-gray-400">
                        Contact us at{' '}
                        <a href="mailto:support@nexusbiz.ai" className="text-blue hover:underline">
                            support@nexusbiz.ai
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;
