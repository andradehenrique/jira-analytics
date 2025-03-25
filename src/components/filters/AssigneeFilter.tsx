'use client';

import React from 'react';

interface JiraUser {
  accountId: string;
  displayName: string;
  avatarUrls?: {
    [key: string]: string;
  };
}

interface AssigneeFilterProps {
  users: JiraUser[];
  selectedAssignees: string[];
  onChange: (assigneeIds: string[]) => void;
}

export default function AssigneeFilter({
  users,
  selectedAssignees,
  onChange
}: AssigneeFilterProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Responsável
      </label>
      <select
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={selectedAssignees[0] || ''}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value ? [value] : []);
        }}
      >
        <option value="">Todos os responsáveis</option>
        <option value="unassigned">Não atribuído</option>
        {users.map((user) => (
          <option key={user.accountId} value={user.accountId}>
            {user.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}