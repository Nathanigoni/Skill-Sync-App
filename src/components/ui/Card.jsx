import React from 'react'

const Card = ({ children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`glass-card ${padding} ${className}`}>
      {children}
    </div>
  )
}

export default Card