
import React from 'react';

const CakeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 15.75a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75V14.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v1.5Zm-16.5-1.5h16.5m-16.5 0V9.75a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v4.5m-16.5 0h16.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 14.25v-2.625a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V14.25"
    />
  </svg>
);

export default CakeIcon;
