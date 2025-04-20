import React from 'react';
import { VerticalTimeline as OriginalVerticalTimeline, VerticalTimelineElement as OriginalVerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

// Wrapper components to handle compatibility with React 19
export const VerticalTimeline: React.FC<React.PropsWithChildren<any>> = (props) => {
  return React.createElement(
    OriginalVerticalTimeline,
    props,
    props.children
  );
};

export const VerticalTimelineElement: React.FC<React.PropsWithChildren<any>> = (props) => {
  return React.createElement(
    OriginalVerticalTimelineElement,
    props,
    props.children
  );
}; 