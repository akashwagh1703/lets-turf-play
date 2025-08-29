import React from 'react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft focus-visible:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-soft focus-visible:ring-secondary',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-soft focus-visible:ring-accent',
    outline: 'border border-border bg-transparent text-foreground hover:bg-muted focus-visible:ring-primary',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft focus-visible:ring-destructive'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }
  
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="w-5 h-5 animate-spin" />
      ) : (
        <span className="flex items-center justify-center gap-2">{children}</span>
      )}
    </motion.button>
  )
}
