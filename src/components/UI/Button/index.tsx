import React from 'react'
import { ButtonProps } from './interface'
import { brandPrimary, brandSecondary } from './style'
import { cn } from '@/utilities/utility';
import { LoaderCircle } from 'lucide-react';

const Button = ({
  variant,
  buttonLabel = '',
  onClick,
  tone,
  customClass = '',
  isLoading = false,
  disabled
} : ButtonProps) => {
  console.log('disabled====', buttonLabel ,disabled)
  return (
    <button 
    className={cn({
      [brandPrimary({colorTone : tone})] : variant === "brand-primary",
      [brandSecondary({colorTone : tone})] : variant === "brand-secondary",
      [customClass] : customClass
    })}
    onClick={() => {onClick()}}
    disabled={disabled}
    >
      {isLoading ? <LoaderCircle className='animate-spin'/> : buttonLabel}
    </button>
  )
}

export default Button