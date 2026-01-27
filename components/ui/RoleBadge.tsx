import React from 'react'
import { Shield, Crown, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  size?: 'sm' | 'md' | 'lg'
}

export default function RoleBadge({ role, size = 'md' }: Props) {
  const configs = {
    ADMIN: {
      label: 'Admin',
      icon: Crown,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    },
    MANAGER: {
      label: 'Manager',
      icon: Shield,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    EMPLOYEE: {
      label: 'Employee',
      icon: User,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200'
    }
  }

  const config = configs[role]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-lg font-bold border',
      config.bgColor,
      config.textColor,
      config.borderColor,
      sizeClasses[size]
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  )
}
