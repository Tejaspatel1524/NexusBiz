import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedIdea {
    id: string;
    title: string;
    description: string;
    industry: string;
    investmentNeeded: string;
    timeline: string;
    savedAt: number;
    // Checklist progress for this idea
    completedSteps: string[];
}

interface SavedIdeasState {
    savedIdeas: SavedIdea[];
    saveIdea: (idea: Omit<SavedIdea, 'completedSteps'>) => void;
    unsaveIdea: (id: string) => void;
    isIdeaSaved: (id: string) => boolean;
    getSavedIdeas: () => SavedIdea[];
    // Checklist methods
    toggleChecklistStep: (ideaId: string, stepId: string) => void;
    getCompletedSteps: (ideaId: string) => string[];
}

export const useSavedIdeasStore = create<SavedIdeasState>()(
    persist(
        (set, get) => ({
            savedIdeas: [],

            saveIdea: (idea) => {
                const { savedIdeas } = get();
                if (!savedIdeas.find((i) => i.id === idea.id)) {
                    set({
                        savedIdeas: [
                            ...savedIdeas,
                            { ...idea, savedAt: Date.now(), completedSteps: [] }
                        ]
                    });
                }
            },

            unsaveIdea: (id) => {
                set({
                    savedIdeas: get().savedIdeas.filter((idea) => idea.id !== id)
                });
            },

            isIdeaSaved: (id) => {
                return get().savedIdeas.some((idea) => idea.id === id);
            },

            getSavedIdeas: () => {
                return get().savedIdeas.sort((a, b) => b.savedAt - a.savedAt);
            },

            // Toggle a checklist step for a specific idea
            toggleChecklistStep: (ideaId, stepId) => {
                set({
                    savedIdeas: get().savedIdeas.map((idea) => {
                        if (idea.id !== ideaId) return idea;

                        const completedSteps = idea.completedSteps || [];
                        const isCompleted = completedSteps.includes(stepId);

                        return {
                            ...idea,
                            completedSteps: isCompleted
                                ? completedSteps.filter(s => s !== stepId)
                                : [...completedSteps, stepId]
                        };
                    })
                });
            },

            // Get completed steps for an idea
            getCompletedSteps: (ideaId) => {
                const idea = get().savedIdeas.find(i => i.id === ideaId);
                return idea?.completedSteps || [];
            }
        }),
        {
            name: 'nexusbiz-saved-ideas'
        }
    )
);
