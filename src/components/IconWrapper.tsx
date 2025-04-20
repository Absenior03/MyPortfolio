import React from 'react';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';

interface IconWrapperProps {
  icon: IconType;
  className?: string;
}

// Wrapper component to handle React Icons in React 19
const IconWrapper: React.FC<IconWrapperProps> = ({ icon, className }) => {
  // Create the icon element directly
  const IconComponent = icon as React.ComponentType<IconBaseProps>;
  
  return (
    <span className={className}>
      <IconComponent />
    </span>
  );
};

export default IconWrapper; 