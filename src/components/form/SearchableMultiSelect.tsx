// components/SearchableMultiSelect.tsx
import { useState, useEffect, useRef } from 'react';
import { Option } from '@/types/components'


interface SearchableMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  label: string;
  placeholder?: string;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  placeholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

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

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedValues.includes(option.value) ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedValues.map((value) => (
          <div
            key={value}
            className="px-2 py-1 text-sm bg-blue-100 rounded flex items-center"
          >
            {options.find((o) => o.value === value)?.label}
            <button
              className="ml-2 text-red-500"
              onClick={() => handleSelect(value)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchableMultiSelect;