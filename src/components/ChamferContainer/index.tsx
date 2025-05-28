import React from 'react';

export const ChamferContainer = ({ 
  chamfer = 12, 
  className = '', 
  style = {},
  borderColor = '#ef4444',
  borderWidth = 2,
  backgroundColor = 'black',
  ...props 
}) => {
  const chamferPath = `polygon(
    ${chamfer}px 0, 
    calc(100% - ${chamfer}px) 0, 
    100% ${chamfer}px, 
    100% calc(100% - ${chamfer}px), 
    calc(100% - ${chamfer}px) 100%, 
    ${chamfer}px 100%, 
    0 calc(100% - ${chamfer}px), 
    0 ${chamfer}px
  )`;

  return (
    <div
      className={`chamfer-container w-full h-full ${className}`}
      style={{
        top:0,
        right:0,
        position:'absolute',
        zIndex:'-2',
        background: borderColor,
        clipPath: chamferPath,
        padding: `${borderWidth}px`,
        ...style
      }}
      {...props}
    >
      <div
        style={{
          background: backgroundColor,
          clipPath: chamferPath,
          height: '100%',
        }}
      >
      </div>
    </div>
  );
};
