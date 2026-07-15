import React from 'react'

export default function WaveDivider() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      lineHeight: 0,
      zIndex: 20
    }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        style={{
          display: 'block',
          width: 'calc(100% + 100px)',
          marginLeft: '-50px',
          height: '40px', /* Reduced height for subtlety */
        }}
      >
        {/* Trait subtil jaune or */}
        <path 
          d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60" 
          fill="none" 
          stroke="var(--gold)" 
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  )
}
