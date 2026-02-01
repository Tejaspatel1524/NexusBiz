import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepOne from '../components/wizard/StepOne';
import StepTwo from '../components/wizard/StepTwo';
import StepThree from '../components/wizard/StepThree';
import StepFour from '../components/wizard/StepFour';
import { useBusinessStore } from '../store/useBusinessStore';
import type { BusinessIdeaInputs } from '../types';
import { PlanSkeleton } from '../components/common/Skeleton';
import LiquidBackground from '../components/common/LiquidBackground';

const Generator: React.FC = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { isLoading, setInputs, setIsLoading, setGeneratedIdeas } = useBusinessStore();

    const methods = useForm<BusinessIdeaInputs>({
        defaultValues: {
            skills: [],
            resources: {
                team: false,
                office: false,
                equipment: false,
                funding: false,
            },
        }
    });

    const handleNext = async () => {
        const fieldsToValidate = getFieldsForStep(step);
        const isValid = await methods.trigger(fieldsToValidate as any);

        if (isValid) {
            if (step < 4) {
                setStep(step + 1);
            } else {
                await handleGenerate();
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate('/');
        }
    };

    const getFieldsForStep = (currentStep: number) => {
        switch (currentStep) {
            case 1: return ['industry', 'budget', 'location', 'timeline'];
            case 2: return ['skills', 'riskTolerance'];
            case 3: return ['businessModel', 'marketSize', 'innovationLevel'];
            default: return [];
        }
    };

    const handleGenerate = async () => {
        const data = methods.getValues();
        setInputs(data);
        setIsLoading(true);

        console.log('Starting idea generation with inputs:', data);

        try {
            const { generateIdeas } = await import('../utils/api');

            console.log('Calling Ollama API...');

            const ideas = await generateIdeas(
                {
                    industry: data.industry || 'Technology',
                    budgetMin: getBudgetMin(data.budget),
                    budgetMax: getBudgetMax(data.budget),
                    location: data.location || 'United States',
                    timeline: data.timeline || '6-12 months',
                    skills: data.skills || [],
                    riskTolerance: data.riskTolerance || 'medium',
                    businessModel: data.businessModel || ['B2C'],
                    targetMarket: data.marketSize || 'General consumers',
                },
                (progress) => {
                    console.log('Progress:', progress);
                }
            );

            console.log('Raw API response:', ideas);

            let ideasArray: any[] = [];
            if (Array.isArray(ideas)) {
                ideasArray = ideas;
            } else if (ideas && typeof ideas === 'object') {
                const ideasObj = ideas as any;
                if (Array.isArray(ideasObj.ideas)) {
                    ideasArray = ideasObj.ideas;
                } else {
                    ideasArray = [ideas];
                }
            }

            console.log('Parsed ideas array:', ideasArray);

            if (ideasArray.length === 0) {
                throw new Error('No ideas were generated');
            }

            const formattedIdeas = ideasArray.map((idea: any, index: number) => ({
                id: idea.id || String(index + 1),
                title: idea.title || `Business Idea ${index + 1}`,
                description: idea.description || idea.oneLiner || 'AI-generated business concept',
                industry: idea.industry || data.industry || 'General',
                difficultyScore: idea.difficultyScore || idea.viabilityScore || 5,
                investmentNeeded: idea.investmentNeeded ||
                    (idea.initialInvestment ? `$${idea.initialInvestment.toLocaleString()}` : data.budget) ||
                    '$10k-$50k',
                potentialROI: idea.potentialROI ||
                    (idea.estimatedFirstYearRevenue ?
                        `$${idea.estimatedFirstYearRevenue.min?.toLocaleString() || '0'} - $${idea.estimatedFirstYearRevenue.max?.toLocaleString() || '0'}` :
                        'TBD'),
                timeline: idea.timeline ||
                    (idea.timelineMonths ? `${idea.timelineMonths} months` : data.timeline) ||
                    '6 months',
            }));

            console.log('Formatted ideas:', formattedIdeas);

            // @ts-ignore - type mismatch due to Partial in store
            setGeneratedIdeas(formattedIdeas);
            setIsLoading(false);
            navigate('/results');
        } catch (error: any) {
            console.error('Error generating ideas:', error);
            setIsLoading(false);

            const errorMessage = error.message || 'Unknown error occurred';
            alert(`Failed to generate ideas: ${errorMessage}\n\nPlease ensure:\n1. Backend server is running on port 5000\n2. Ollama is running\n3. Check console for details`);
        }
    };

    const getBudgetMin = (budget?: string): number => {
        if (!budget) return 10000;
        const match = budget.match(/\$?([\d,]+)k?/i);
        if (match) {
            const value = parseInt(match[1].replace(/,/g, ''));
            return budget.toLowerCase().includes('k') ? value * 1000 : value;
        }
        return 10000;
    };

    const getBudgetMax = (budget?: string): number => {
        if (!budget) return 50000;
        const parts = budget.split('-');
        if (parts.length > 1) {
            const match = parts[1].match(/\$?([\d,]+)k?/i);
            if (match) {
                const value = parseInt(match[1].replace(/,/g, ''));
                return budget.toLowerCase().includes('k') ? value * 1000 : value;
            }
        }
        return 50000;
    };

    const stepLabels = ['Market', 'Skills', 'Strategy', 'Launch'];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Liquid Background */}
            <LiquidBackground />

            {/* Content */}
            <div className="relative z-10 pt-28 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {isLoading ? (
                        <motion.div
                            className="space-y-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="text-center space-y-4 mb-16">
                                <motion.div
                                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: 'var(--gradient-primary)' }}
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles size={32} className="text-white" />
                                </motion.div>
                                <h2 className="text-3xl font-black gradient-text">Generating Your Ideas</h2>
                                <p className="text-theme-secondary max-w-md mx-auto">
                                    AI is architecting your business concepts based on your parameters...
                                </p>
                            </div>
                            <PlanSkeleton />
                        </motion.div>
                    ) : (
                        <>
                            {/* Header */}
                            <motion.div
                                className="text-center mb-12"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h1 className="text-4xl font-black mb-3">
                                    <span className="text-theme-primary">Business </span>
                                    <span className="gradient-text">Generator</span>
                                </h1>
                                <p className="text-theme-secondary">Configure your ideal business parameters</p>
                            </motion.div>

                            {/* Progress Tracker */}
                            <div className="mb-10">
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4].map((s) => (
                                        <div
                                            key={s}
                                            className="flex-1 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                background: s <= step ? 'var(--gradient-primary)' : 'var(--glass-bg)',
                                                border: s > step ? '1px solid var(--glass-border)' : 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between px-2">
                                    {stepLabels.map((label, i) => (
                                        <span
                                            key={label}
                                            className={`text-xs font-semibold transition-colors ${i + 1 <= step ? 'text-indigo-400' : 'text-theme-muted'
                                                }`}
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Wizard Form */}
                            <motion.div
                                className="liquid-glass p-8 md:p-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <FormProvider {...methods}>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={step}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {step === 1 && <StepOne />}
                                                {step === 2 && <StepTwo />}
                                                {step === 3 && <StepThree />}
                                                {step === 4 && <StepFour />}
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="mt-12 pt-8 border-t border-theme flex justify-between items-center">
                                            <motion.button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex items-center gap-2 text-theme-secondary hover:text-theme-primary transition-colors font-medium"
                                                whileHover={{ x: -4 }}
                                            >
                                                <ArrowLeft size={18} />
                                                {step === 1 ? 'Cancel' : 'Back'}
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                onClick={handleNext}
                                                className="liquid-btn flex items-center gap-2 px-8 py-4"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {step === 4 ? (
                                                    <>Generate Ideas <Zap size={18} className="fill-current" /></>
                                                ) : (
                                                    <>Continue <ArrowRight size={18} /></>
                                                )}
                                            </motion.button>
                                        </div>
                                    </form>
                                </FormProvider>
                            </motion.div>

                            <p className="mt-10 text-center text-xs text-theme-muted">
                                Step {step} of 4 • NexusBiz AI Engine
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Generator;
