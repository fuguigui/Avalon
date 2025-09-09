import type { SVGProps } from 'react';

export function KnightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l-3 3-2 9h10l-2-9z" />
      <path d="M12 14v8" />
      <path d="M12 14h-4" />
      <path d="M12 14h4" />
      <path d="M12 22s-2-1-2-4" />
      <path d="M12 22s2-1 2-4" />
      <path d="M8 14l-2 4" />
      <path d="M16 14l2 4" />
      <circle cx="12" cy="8" r="1" />
    </svg>
  );
}
