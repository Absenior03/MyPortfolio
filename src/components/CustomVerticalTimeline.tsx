import React, { PropsWithChildren, ReactNode } from 'react';
// Removed the CSS import as it's now in _app.tsx

interface VerticalTimelineProps {
  className?: string;
  animate?: boolean;
  lineColor?: string;
}

interface VerticalTimelineElementProps {
  className?: string;
  contentStyle?: React.CSSProperties;
  contentArrowStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  icon?: ReactNode;
  date?: string;
}

export const VerticalTimeline: React.FC<PropsWithChildren<VerticalTimelineProps>> = ({ 
  children, 
  className = "",
  animate = true,
  lineColor = "#915EFF"
}) => {
  return (
    <div className={`vertical-timeline ${animate ? 'vertical-timeline--animate' : ''} ${className}`}>
      <div 
        className="vertical-timeline-line" 
        style={{ backgroundColor: lineColor }}
      ></div>
      {children}
    </div>
  );
};

export const VerticalTimelineElement: React.FC<PropsWithChildren<VerticalTimelineElementProps>> = ({ 
  children, 
  className = "",
  contentStyle = {},
  contentArrowStyle = {},
  iconStyle = {},
  icon,
  date 
}) => {
  return (
    <div className={`vertical-timeline-element ${className}`}>
      {icon && (
        <div className="vertical-timeline-element-icon" style={iconStyle}>
          {icon}
        </div>
      )}
      
      <div className="vertical-timeline-element-content" style={contentStyle}>
        <div className="vertical-timeline-element-content-arrow" style={contentArrowStyle}></div>
        {date && (
          <div className="vertical-timeline-element-date">{date}</div>
        )}
        {children}
      </div>
    </div>
  );
}; 