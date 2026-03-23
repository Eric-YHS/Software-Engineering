import React from 'react';

const Skeleton = ({ className }) => (
  <div 
    className={`animate-pulse bg-[#E5E5EA] rounded-[18px] ${className}`}
  />
);

export default Skeleton;
