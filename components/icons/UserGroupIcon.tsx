
import React from 'react';

const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.966c.57-2.54 2.572-4.5 5.093-4.5h.005a5.992 5.992 0 0 1 5.918 5.025m-11.918 0c-.57-2.54 2.572-4.5 5.093-4.5h.005a5.992 5.992 0 0 1 5.918 5.025M5.25 15.025a5.992 5.992 0 0 1 5.918-5.025h.005a5.992 5.992 0 0 1 5.918 5.025M5.25 15.025c.57-2.54 2.572-4.5 5.093-4.5h.005a5.992 5.992 0 0 1 5.918 5.025"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 8.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"
    />
  </svg>
);

export default UserGroupIcon;
