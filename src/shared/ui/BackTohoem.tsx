'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../libs/chadcn/utils';

interface BackToHomeProps {
    className?: string;
}

export const BackToHome = ({ className }: BackToHomeProps) => {
    return (
        <Link href="/" className={cn('inline-block', className)}>
            <motion.div
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                whileHover="hover"
                initial="initial"
            >
                <motion.div
                    variants={{
                        initial: { x: 0 },
                        hover: { x: -4 },
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </motion.div>

                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    Back to Home
                </span>
            </motion.div>
        </Link>
    );
};