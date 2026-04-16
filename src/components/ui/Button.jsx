import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-smooth focus:outline-none focus:ring-2 focus:ring-offset-2'
  
    const variants = {
    primary: 'bg-zinc-500 hover:bg-zinc-600 text-white focus:ring-zinc-500',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white focus:ring-zinc-500',
    outline: 'border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:ring-zinc-500'
    }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button