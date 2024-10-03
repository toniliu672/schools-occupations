import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { SidebarProps } from '@/types/components'
import { useResponsiveLayout } from '@/hooks'

const Sidebar: React.FC<SidebarProps> = ({
  children,
  className,
  initiallyExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)
  const [mounted, setMounted] = useState(false)
  const isMobile = useResponsiveLayout(768) // Using the custom hook

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => setIsExpanded(!isExpanded)

  const sidebarStyles = twMerge(
    'transition-all duration-300 ease-in-out',
    'bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90',
    'backdrop-filter backdrop-blur-lg',
    'border border-gray-200 dark:border-gray-700 shadow-xl',
    'text-gray-800 dark:text-gray-200',
    isMobile
      ? 'fixed left-0 right-0 bottom-0 w-full rounded-t-2xl'
      : 'fixed right-4 top-20 bottom-4 rounded-2xl',
    isMobile
      ? isExpanded ? 'h-[calc(50vh-1rem)]' : 'h-16'
      : isExpanded ? 'w-64' : 'w-20',
    className
  )

  const toggleButtonStyles = twMerge(
    'absolute bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90',
    'backdrop-filter backdrop-blur-lg',
    'border border-gray-200 dark:border-gray-700 rounded-full p-1.5',
    'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
    'transition-colors duration-200',
    'z-20',
    isMobile
      ? 'top-2 left-1/2 -translate-x-1/2'
      : '-left-3 top-1/2 -translate-y-1/2'
  )

  const contentStyles = twMerge(
    'p-4 relative',
    isMobile ? (isExpanded ? 'block' : 'hidden') : (isExpanded ? '' : 'hidden'),
    isMobile && isExpanded ? 'h-[calc(50vh-5rem)] overflow-y-auto' : ''
  )

  if (!mounted) return null

  return (
    <div className={sidebarStyles}>
      <button
        onClick={toggleSidebar}
        className={toggleButtonStyles}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isMobile ? (
          isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
        ) : (
          isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
        )}
      </button>
      <div className={contentStyles}>
        {children}
      </div>
    </div>
  )
}

export default Sidebar