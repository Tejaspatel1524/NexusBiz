import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock, TrendingUp, Target } from 'lucide-react';
import { useComparisonStore } from '../../store/useComparisonStore';
import { calculateSuccessScore } from '../common/SuccessScoreBadge';

const ComparisonModal: React.FC = () => {
    const { selectedIdeas, isModalOpen, closeModal, clearSelection } = useComparisonStore();

    if (!isModalOpen || selectedIdeas.length < 2) return null;

    const handleClose = () => {
        closeModal();
        clearSelection();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="liquid-glass w-full max-w-5xl max-h-[90vh] overflow-auto p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black gradient-text">Compare Ideas</h2>
                            <p className="text-theme-muted text-sm mt-1">Side-by-side comparison of {selectedIdeas.length} ideas</p>
                        </div>
                        <motion.button
                            onClick={handleClose}
                            className="w-10 h-10 rounded-xl bg-theme-tertiary/50 flex items-center justify-center text-theme-muted hover:text-white hover:bg-theme-tertiary transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X size={20} />
                        </motion.button>
                    </div>

                    {/* Comparison Grid */}
                    <div className={`grid gap-6 ${selectedIdeas.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {selectedIdeas.map((idea, index) => {
                            const successScore = calculateSuccessScore(
                                idea.difficultyScore,
                                idea.investmentNeeded,
                                idea.timeline
                            );

                            return (
                                <motion.div
                                    key={idea.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="liquid-glass-subtle p-6 rounded-2xl"
                                >
                                    {/* Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                            {idea.industry}
                                        </span>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${successScore >= 75 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                                                successScore >= 50 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                                                    'bg-gradient-to-br from-orange-500 to-red-500'
                                            }`}>
                                            {successScore}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-theme-primary mb-2 line-clamp-2">
                                        {idea.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-theme-secondary text-sm mb-6 line-clamp-3">
                                        {idea.description}
                                    </p>

                                    {/* Metrics */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-theme-tertiary/30">
                                            <span className="flex items-center text-xs text-theme-muted">
                                                <DollarSign size={14} className="mr-2 text-green-400" /> Investment
                                            </span>
                                            <span className="text-sm font-bold text-theme-primary">{idea.investmentNeeded}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-theme-tertiary/30">
                                            <span className="flex items-center text-xs text-theme-muted">
                                                <Clock size={14} className="mr-2 text-blue-400" /> Timeline
                                            </span>
                                            <span className="text-sm font-bold text-theme-primary">{idea.timeline}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-theme-tertiary/30">
                                            <span className="flex items-center text-xs text-theme-muted">
                                                <TrendingUp size={14} className="mr-2 text-purple-400" /> Viability
                                            </span>
                                            <span className="text-sm font-bold text-theme-primary">{idea.difficultyScore}/10</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-theme-tertiary/30">
                                            <span className="flex items-center text-xs text-theme-muted">
                                                <Target size={14} className="mr-2 text-amber-400" /> Success Score
                                            </span>
                                            <span className={`text-sm font-bold ${successScore >= 75 ? 'text-green-400' :
                                                    successScore >= 50 ? 'text-amber-400' : 'text-orange-400'
                                                }`}>
                                                {successScore}%
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-theme text-center">
                        <p className="text-theme-muted text-sm">
                            💡 <span className="text-theme-secondary">Tip:</span> Higher success scores indicate better viability with your budget and timeline.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ComparisonModal;
