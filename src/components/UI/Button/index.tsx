import React from 'react'
import { ButtonProps } from './interface'
import { brandPrimary, brandSecondary } from './style'
import { cn } from '@/utilities/utility'

const Button = ({
  variant,
  buttonLabel = '',
  onClick,
  tone,
  customClass = ''
} : ButtonProps) => {
  return (
    <button 
    className={cn({
      [brandPrimary({colorTone : tone})] : variant === "brand-primary",
      [brandSecondary({colorTone : tone})] : variant === "brand-secondary",
      [customClass] : customClass
    })}
    onClick={onClick}
    >
      {buttonLabel}
    </button>
  )
}

export default Button