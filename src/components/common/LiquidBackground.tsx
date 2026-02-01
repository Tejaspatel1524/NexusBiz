import React from 'react';
import { motion } from 'framer-motion';

interface LiquidBackgroundProps {
    showBlobs?: boolean;
    className?: string;
}

const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
    showBlobs = true,
    className = ''
}) => {
    return (
        <>
            {/* Animated Gradient Background */}
            <div className={`liquid-bg ${className}`} />

            {/* Liquid Blobs */}
            {showBlobs && (
                <>
                    <motion.div
                        className="liquid-blob liquid-blob-1"
                        animate={{
                            x: [0, 30, -20, 0],
                            y: [0, -30, 20, 0],
                            scale: [1, 1.05, 0.95, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="liquid-blob liquid-blob-2"
                        animate={{
                            x: [0, -20, 30, 0],
                            y: [0, 20, -30, 0],
                            scale: [1, 0.95, 1.05, 1]
                        }}
                        transition={{ duration: 8, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="liquid-blob liquid-blob-3"
                        animate={{
                            scale: [1, 1.1, 0.9, 1]
                        }}
                        transition={{ duration: 8, delay: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </>
            )}
        </>
    );
};

export default LiquidBackground;
