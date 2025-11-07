
import React from 'react';

const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25M12 4.875A3.375 3.375 0 0 0 9.375 1.5H9a3.375 3.375 0 0 0-3.375 3.375v.375m10.5 0v-.375A3.375 3.375 0 0 0 15 1.5h-.375A3.375 3.375 0 0 0 12 4.875M21 11.25H3"
    />
  </svg>
);

export default GiftIcon;
