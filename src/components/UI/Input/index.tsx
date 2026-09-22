import React from 'react'
import { InputProps } from './interface'
import { cn } from '@/utilities/utility'

const Input = ({
    type,
    placeholder,
    inputTitle = "Title",
    defaultValue = "",
    error = false,
    errorMessage = "Error message",
    tabIndex,
    name
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 transition duration-600 ease-in-out">
        {inputTitle && <label className={cn({
            ['font-semibold']: true,
            ['text-danger']: error,
        })}>{inputTitle}</label>}
        <input
            className={ cn({
                ["rounded-lg border border-2 border-gray-200 p-2 w-full"]: true,
                ["border-danger"]: error,
            })}
            type={type ?? 'text'}
            placeholder={placeholder}
            defaultValue={defaultValue}
            spellCheck={true}
            min={0}
            tabIndex={tabIndex}
            name={name}
        />
        {error && errorMessage && <span className='text-danger text-sm'>{errorMessage}</span>}
    </div>
  )
}

export default Input