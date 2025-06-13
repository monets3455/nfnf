

import React, { useState, KeyboardEvent } from 'react';
import { XMarkIcon, PlusIcon } from '../icons';
import Input from './Input'; 
// import { ACCENT_COLOR } from '../../constants'; // No longer needed if classes are static

interface TagInputProps {
  label?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  id?: string; 
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ label, tags, setTags, placeholder = "Add a tag...", suggestions = [], id, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setInputValue(e.target.value);
    if (e.target.value && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const addTag = (tagValue: string) => {
    if (disabled) return;
    const newTag = tagValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (disabled) return;
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const filteredSuggestions = suggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion)
  );

  const inputId = id ? `${id}-input-field` : (label ? `${label.toLowerCase().replace(/\s+/g, '-')}-tag-input-field` : 'tag-input-field');

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-base font-medium text-neutral-700 dark:text-neutral-100 mb-1.5">{label}</label>} {/* Changed from text-sm, mb-1 to mb-1.5 */}
      <div className={`flex flex-wrap items-center gap-2 p-2.5 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 rounded-md ${disabled ? 'opacity-70 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800' : ''}`}> {/* Increased padding */}
        {tags.map(tag => (
          <span key={tag} className={`flex items-center bg-brand-teal bg-opacity-20 text-brand-teal text-base font-medium px-3 py-1 rounded-full`}> {/* Changed text-sm to text-base, px-2.5 py-0.5 to px-3 py-1 */}
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
              className={`ml-2 text-brand-teal hover:text-black dark:hover:text-white ${disabled ? 'cursor-not-allowed' : ''}`}
              disabled={disabled}
              aria-label={`Remove tag ${tag}`}
            > 
              <XMarkIcon className="w-4 h-4" /> {/* Increased XMarkIcon from w-3 h-3 */}
            </button>
          </span>
        ))}
        <div className="relative flex-grow">
          <Input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => !disabled && inputValue && suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            disabled={disabled}
            className="bg-transparent border-none focus:ring-0 p-0 flex-grow min-w-[120px] !shadow-none text-base" 
          />
          {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-lg max-h-48 overflow-y-auto"> {/* Increased max-h-40 to max-h-48 */}
              {filteredSuggestions.map(suggestion => (
                <div
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  className="px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-base text-neutral-800 dark:text-neutral-100" // Changed text-sm to text-base, py-2 to py-2.5
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
         {inputValue && !disabled && (
           <button 
            type="button" 
            onClick={() => addTag(inputValue)} 
            className={`text-brand-teal hover:text-black dark:hover:text-white p-1.5 rounded-full hover:bg-brand-teal hover:bg-opacity-10 dark:hover:bg-opacity-10 ${disabled ? 'cursor-not-allowed' : ''}`}
            disabled={disabled}
            aria-label="Add tag"
           >
            <PlusIcon className="w-5 h-5"/> {/* Increased w-4 h-4 to w-5 h-5 */}
           </button>
         )}
      </div>
    </div>
  );
};

export default TagInput;