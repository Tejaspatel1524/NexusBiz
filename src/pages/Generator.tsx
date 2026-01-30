import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import StepOne from '../components/wizard/StepOne';
import StepTwo from '../components/wizard/StepTwo';
import StepThree from '../components/wizard/StepThree';
import StepFour from '../components/wizard/StepFour';
import { useBusinessStore } from '../store/useBusinessStore';
import type { BusinessIdeaInputs } from '../types';

const Generator: React.FC = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { setInputs, setIsLoading, setGeneratedIdeas } = useBusinessStore();

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
            // Import API service
            const { generateIdeas } = await import('../utils/api');

            console.log('Calling Ollama API...');

            // Call Ollama API with progress tracking
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

            // Handle different response formats
            let ideasArray: any[] = [];
            if (Array.isArray(ideas)) {
                ideasArray = ideas;
            } else if (ideas && typeof ideas === 'object') {
                // Check if it's wrapped in an 'ideas' property
                const ideasObj = ideas as any;
                if (Array.isArray(ideasObj.ideas)) {
                    ideasArray = ideasObj.ideas;
                } else {
                    // Single idea object, wrap in array
                    ideasArray = [ideas];
                }
            }

            console.log('Parsed ideas array:', ideasArray);

            if (ideasArray.length === 0) {
                throw new Error('No ideas were generated');
            }

            // Transform API response to match expected format
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

            // Show more helpful error message
            const errorMessage = error.message || 'Unknown error occurred';
            alert(`Failed to generate ideas: ${errorMessage}\n\nPlease ensure:\n1. Backend server is running on port 5000\n2. Ollama is running\n3. Check console for details`);
        }
    };

    // Helper functions for budget parsing
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

    return (
        <div className="min-h-screen pt-32 pb-20 geometric-grid">
            <div className="max-w-4xl mx-auto px-4">
                {/* Progress Tracker */}
                <div className="mb-12">
                    <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-1 transition-all duration-500 ${s <= step ? 'bg-blue' : 'bg-gray-400'
                                    } ${s !== 1 ? 'ml-2' : ''}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-200">Landscape</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-200">Assets</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-200">Strategy</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-200">Launch</span>
                    </div>
                </div>

                {/* Wizard Form */}
                <div className="bg-black border border-gray-400 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue opacity-5 -mr-16 -mt-16 rotate-45" />

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

                            <div className="mt-16 pt-8 border-t border-gray-400 flex justify-between items-center">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="px-0"
                                >
                                    <ArrowLeft className="mr-2" size={18} /> {step === 1 ? 'Cancel' : 'Previous Phase'}
                                </Button>

                                <Button
                                    onClick={handleNext}
                                    className="px-12"
                                >
                                    {step === 4 ? (
                                        <>Initiate Synthesis <Zap className="ml-2 fill-current" size={18} /></>
                                    ) : (
                                        <>Proceed to Next Phase <ArrowRight className="ml-2" size={18} /></>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>

                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                    NexusBiz Strategic Intelligence Engine v1.0.4
                </p>
            </div>
        </div>
    );
};

export default Generator;
