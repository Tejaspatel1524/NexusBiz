import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
    value: number | string;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 2,
    prefix = '',
    suffix = '',
    className = ''
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const [displayValue, setDisplayValue] = useState(0);

    // Parse numeric value from string if needed
    const numericValue = typeof value === 'string'
        ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0
        : value;

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setDisplayValue(Math.floor(easeOutQuart * numericValue));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setDisplayValue(numericValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isInView, numericValue, duration]);

    // Format number with commas
    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
        >
            {prefix}{formatNumber(displayValue)}{suffix}
        </motion.span>
    );
};

export default AnimatedCounter;
