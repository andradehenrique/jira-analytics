'use client';

import React from 'react';

interface Status {
  id: string;
  name: string;
  statusCategory?: {
    key: string;
    name: string;
  };
}

interface StatusFilterProps {
  statuses: Status[];
  selectedStatuses: string[];
  onChange: (statusIds: string[]) => void;
}

export default function StatusFilter({
  statuses,
  selectedStatuses,
  onChange
}: StatusFilterProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Status
      </label>
      <select
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={selectedStatuses[0] || ''}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value ? [value] : []);
        }}
      >
        <option value="">Todos os status</option>
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.name}
          </option>
        ))}
      </select>
    </div>
  );
}