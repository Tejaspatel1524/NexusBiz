import { create } from 'zustand';
import type { BusinessIdea } from '../types';

interface ComparisonState {
    selectedIdeas: BusinessIdea[];
    isCompareMode: boolean;
    isModalOpen: boolean;

    toggleCompareMode: () => void;
    toggleIdeaSelection: (idea: BusinessIdea) => void;
    clearSelection: () => void;
    isIdeaSelected: (id: string) => boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
    selectedIdeas: [],
    isCompareMode: false,
    isModalOpen: false,

    toggleCompareMode: () => {
        const currentMode = get().isCompareMode;
        set({
            isCompareMode: !currentMode,
            selectedIdeas: !currentMode ? [] : get().selectedIdeas
        });
    },

    toggleIdeaSelection: (idea) => {
        const { selectedIdeas } = get();
        const isSelected = selectedIdeas.some((i) => i.id === idea.id);

        if (isSelected) {
            set({ selectedIdeas: selectedIdeas.filter((i) => i.id !== idea.id) });
        } else {
            // Max 3 ideas for comparison
            if (selectedIdeas.length < 3) {
                set({ selectedIdeas: [...selectedIdeas, idea] });
            }
        }
    },

    clearSelection: () => {
        set({ selectedIdeas: [], isCompareMode: false, isModalOpen: false });
    },

    isIdeaSelected: (id) => {
        return get().selectedIdeas.some((idea) => idea.id === id);
    },

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false })
}));
