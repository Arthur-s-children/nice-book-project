import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
