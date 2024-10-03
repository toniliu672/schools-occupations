import { MotionProps } from 'framer-motion'

export interface BaseAnimationProps extends MotionProps {
  children: React.ReactNode
  duration?: number
  delay?: number
}

export type Direction = 'left' | 'right' | 'up' | 'down'