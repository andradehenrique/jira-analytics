'use client';

import React, { useState } from 'react';

interface IdFilterProps {
  selectedIds: string[];
  onChange: (issueIds: string[]) => void;
}

export default function IdFilter({
  selectedIds,
  onChange
}: IdFilterProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddId = () => {
    if (!inputValue.trim()) return;
    
    // Add the new ID if it's not already in the list
    if (!selectedIds.includes(inputValue.trim())) {
      onChange([...selectedIds, inputValue.trim()]);
    }
    
    setInputValue('');
  };

  const handleRemoveId = (idToRemove: string) => {
    onChange(selectedIds.filter(id => id !== idToRemove));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        ID da Issue
      </label>
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite o ID da issue"
          className="flex-grow px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddId();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddId}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Adicionar
        </button>
      </div>
      
      {selectedIds.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IDs selecionados:</p>
          <div className="flex flex-wrap gap-2">
            {selectedIds.map(id => (
              <span 
                key={id} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
              >
                {id}
                <button
                  type="button"
                  onClick={() => handleRemoveId(id)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 dark:text-indigo-300 hover:text-indigo-500 dark:hover:text-indigo-200 focus:outline-none"
                >
                  <span className="sr-only">Remover</span>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}