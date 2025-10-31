import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shadows } from '@/ui/tokens';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
    {
        variants: {
            variant: {
                default: 'text-white shadow-lg border border-white/20',
                destructive: 'text-white shadow-lg border border-white/20',
                outline: 'border-2 border-gray-300 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md',
                secondary: 'bg-white/90 backdrop-blur-sm text-gray-900 shadow-md border border-white/30',
                ghost: 'text-gray-700 hover:bg-white/80 hover:text-gray-900 backdrop-blur-sm',
                link: 'text-green underline-offset-4 hover:underline bg-transparent shadow-none border-none',
                premium: 'text-white shadow-xl border border-white/30',
            },
            size: {
                default: 'h-11 px-6 py-2',
                sm: 'h-9 rounded-lg px-4 text-xs',
                lg: 'h-13 rounded-xl px-8 text-base',
                icon: 'h-11 w-11',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
        // Define gradient backgrounds for different variants
        const getGradientStyle = () => {
            switch (variant) {
                case 'default':
                    return 'linear-gradient(135deg, #5AC568 0%, #4DB858 100%)';
                case 'destructive':
                    return 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)';
                case 'premium':
                    return 'linear-gradient(135deg, #FFD93B 0%, #F6B93B 50%, #ED8936 100%)';
                default:
                    return undefined;
            }
        };

        const gradientStyle = getGradientStyle();

        return (
            <motion.div
                whileHover={{
                    scale: disabled ? 1 : 1.02,
                    y: disabled ? 0 : -1,
                    transition: { duration: 0.15 }
                }}
                whileTap={{
                    scale: disabled ? 1 : 0.98,
                    transition: { duration: 0.1 }
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <button
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    style={{
                        background: gradientStyle,
                        boxShadow: variant === 'default' || variant === 'destructive' || variant === 'premium'
                            ? `${shadows.lg}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                            : undefined,
                    }}
                    disabled={disabled}
                    {...props}
                >
                    {/* Premium shine effect */}
                    {(variant === 'default' || variant === 'premium') && !disabled && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: 'easeInOut'
                            }}
                        />
                    )}

                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-2">
                        {props.children}
                    </span>
                </button>
            </motion.div>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
