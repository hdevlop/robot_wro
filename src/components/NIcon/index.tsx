import React from 'react'
import { ICONS } from './icons'
import { Icon as IconifyIcon } from '@iconify/react'

export type IconComponentProps = {
  size?: string | number,
  icon: React.ComponentType<any> | string,
  color?: string,
  className?: string,
  strokeWidth?: number,
  stroke?: string,
  fill?: string,
  onClick?: any
}

const NIcon = ({
  icon = 'dashboard',
  size = '24',
  color = 'red',
  onClick, // Destructure onClick
  ...rest
}: IconComponentProps) => {
  if (icon && typeof icon === 'object' || typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent size={size} color={color} onClick={onClick} {...rest} />;
  }
  
  if (typeof icon === 'string') {
    if (ICONS[icon]) {
      const IconComponent = ICONS[icon]
      return (
        <IconComponent
          width={size}
          height={size}
          color={color}
          onClick={onClick}
          {...rest}
        />
      )
    }
    
    return <IconifyIcon 
      icon={icon} 
      width={size} 
      height={size} 
      color={color} 
      onClick={onClick}
      {...rest} 
    />
  }
  
  console.warn('Invalid icon prop provided');
  return null;
}

export default NIcon