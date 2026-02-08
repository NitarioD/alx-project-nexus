import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUpAZ, ArrowDownZA } from 'lucide-react';

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sortKey: string) => void;
}

const sortOptions = [
  { key: '-created_at', label: 'Newest First' },
  { key: 'price', label: 'Price: Low to High' },
  { key: '-price', label: 'Price: High to Low' },
  { key: '-average_rating', label: 'Top Rated' },
  { key: 'name', label: 'Name: A to Z' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = sortOptions.find(opt => opt.key === currentSort) || sortOptions[0];

  const handleSelect = (key: string) => {
    onSortChange(key);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Sort By: {selectedOption.label}
        <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  option.key === currentSort 
                    ? 'bg-primary-blue text-white font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                role="menuitem"
              >
                {option.key.includes('price') && (option.key.startsWith('-') ? <ArrowDownZA className="w-4 h-4 mr-2" /> : <ArrowUpAZ className="w-4 h-4 mr-2" />)}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
