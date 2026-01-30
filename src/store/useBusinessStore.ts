import { create } from 'zustand';
import type { BusinessIdea, BusinessIdeaInputs, BusinessPlanDetails } from '../types';

interface BusinessState {
    inputs: Partial<BusinessIdeaInputs>;
    setInputs: (inputs: Partial<BusinessIdeaInputs>) => void;
    generatedIdeas: BusinessIdea[];
    setGeneratedIdeas: (ideas: BusinessIdea[]) => void;
    selectedPlan: BusinessPlanDetails | null;
    setSelectedPlan: (plan: BusinessPlanDetails | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
    inputs: {},
    setInputs: (newInputs) => set((state) => ({ inputs: { ...state.inputs, ...newInputs } })),
    generatedIdeas: [],
    setGeneratedIdeas: (ideas) => set({ generatedIdeas: ideas }),
    selectedPlan: null,
    setSelectedPlan: (plan) => set({ selectedPlan: plan }),
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    currentStep: 1,
    setCurrentStep: (step) => set({ currentStep: step }),
}));
