'use client'

import { Button, ButtonProps } from '@heroui/react'
import { Link } from '@heroui/react'
import { ReactNode } from 'react'
import { theme as themeConfig } from '@/lib/theme'

interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: ReactNode
  href?: string
  target?: string
  rel?: string
  styleVariant?: 'default' | 'settings'
}

export function IconButton({ 
  icon, 
  href, 
  target, 
  rel,
  className = '',
  style,
  styleVariant = 'default',
  ...props 
}: IconButtonProps) {
  // 根据 styleVariant 设置不同的样式
  const baseStyle = styleVariant === 'settings' 
    ? {
        backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)',
        border: '1px solid rgba(var(--primary-color-rgb), 0.2)',
        boxShadow: '0 2px 8px rgba(var(--primary-color-rgb), 0.15)',
        color: 'var(--primary-color)',
        ...style
      }
    : {
        backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)',
        border: '1px solid rgba(var(--primary-color-rgb), 0.2)',
        color: 'var(--primary-color)',
        ...style
      }

  const baseClassName = styleVariant === 'settings'
    ? `text-primary transition-all duration-500 hover:scale-110 hover:rotate-90 hover:bg-gradient-to-br hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:border-[var(--primary-color)] hover:text-white hover:shadow-[0_4px_12px_rgba(var(--primary-color-rgb),0.3)] ${className}`
    : `text-primary transition-all duration-500 hover:scale-110 hover:bg-[rgba(var(--primary-color-rgb),0.1)] hover:text-primary ${className}`

  const buttonProps = {
    isIconOnly: true,
    variant: 'flat' as const,
    color: 'primary' as const,
    size: 'sm' as const,
    className: `${baseClassName} [&_svg]:stroke-current h-9 w-9 sm:h-10 sm:w-10 rounded-2xl`,
    style: baseStyle,
    ...props
  }

  if (href) {
    return (
      <Button
        {...buttonProps}
        as={Link}
        href={href}
        target={target}
        rel={rel}
        className={`${baseClassName} [&_svg]:text-primary [&_svg]:stroke-current`}
      >
        {icon}
      </Button>
    )
  }

  return (
    <Button 
      {...buttonProps}
      className={`${baseClassName} [&_svg]:text-primary [&_svg]:stroke-current`}
    >
      {icon}
    </Button>
  )
}

