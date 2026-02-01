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
}

interface SavedIdeasState {
    savedIdeas: SavedIdea[];
    saveIdea: (idea: SavedIdea) => void;
    unsaveIdea: (id: string) => void;
    isIdeaSaved: (id: string) => boolean;
    getSavedIdeas: () => SavedIdea[];
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
                            { ...idea, savedAt: Date.now() }
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
            }
        }),
        {
            name: 'nexusbiz-saved-ideas'
        }
    )
);
