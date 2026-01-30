import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[250]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-500 border border-gray-400 p-8 shadow-2xl z-[260]"
                    >
                        <div className="flex items-center justify-between mb-8 border-b border-gray-400 pb-4">
                            <h3 className="text-xl font-black uppercase tracking-widest">{title}</h3>
                            <button onClick={onClose} className="text-gray-200 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-8">
                            {children}
                        </div>

                        {footer && (
                            <div className="flex justify-end pt-6 border-t border-gray-400">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
