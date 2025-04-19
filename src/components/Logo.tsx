import React from 'react';

/**
 * Simple mark: cat silhouette inside a heart.
 * Scales with `className` width / height.
 */
const Logo: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    aria-label="Meow Rescue logo"
    className={className}
    {...props}
  >
    <path d="M12 21s-7-4.35-7-10A5 5 0 0 1 12 6a5 5 0 0 1 7 5c0 5.65-7 10-7 10Z" />
    <path
      d="M9.75 9.5c0-.97-.78-1.75-1.75-1.75S6.25 8.53 6.25 9.5 7.03 11.25 8 11.25 9.75 10.47 9.75 9.5Zm7 0c0-.97-.78-1.75-1.75-1.75s-1.75.78-1.75 1.75.78 1.75 1.75 1.75 1.75-.78 1.75-1.75Z"
      fill="#fff"
    />
  </svg>
);

export default Logo;
