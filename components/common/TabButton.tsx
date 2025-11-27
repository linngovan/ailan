/**
 * Reusable tab button component with keyboard navigation and accessibility
 */

import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

const TabButton = React.memo(({ label, icon, isActive, onClick, ariaLabel }: TabButtonProps) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel || label}
    role="tab"
    aria-selected={isActive}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-100 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden text-xs">{label}</span>
  </button>
));

TabButton.displayName = 'TabButton';

export default TabButton;
