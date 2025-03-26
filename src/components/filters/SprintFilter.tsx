'use client';

import React from 'react';
import { JiraSprint } from '@/lib/jira-api';

interface SprintFilterProps {
  sprints: JiraSprint[];
  selectedSprints: string[];
  onChange: (sprintIds: string[]) => void;
}

export default function SprintFilter({
  sprints,
  selectedSprints,
  onChange
}: SprintFilterProps) {
  // Função para formatar datas com tratamento de erros
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data inválida';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Sprint
      </label>
      <select
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={selectedSprints[0] || ''}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value ? [value] : []);
        }}
      >
        <option value="">Todas as sprints</option>
        {sprints.map((sprint) => (
          <option key={sprint.id} value={sprint.id.toString()}>
            {sprint.name} ({formatDate(sprint.startDate)} - {formatDate(sprint.endDate)})
            {sprint.state && ` - ${sprint.state}`}
          </option>
        ))}
      </select>
    </div>
  );
}