'use client';

import React, { useState } from 'react';
import ProjectFilter from './ProjectFilter';
import StatusFilter from './StatusFilter';
import AssigneeFilter from './AssigneeFilter';
import IdFilter from './IdFilter';
import SprintFilter from './SprintFilter';
import type { FilterOptions, JiraProject } from '@/types/jira';
import { JiraStatus, JiraUser, JiraSprint } from '@/lib/jira-api';

interface FiltersPanelProps {
  projects: JiraProject[];
  statuses: JiraStatus[];
  users: JiraUser[];
  sprints: JiraSprint[];
  filters: FilterOptions;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  onApply: () => void;
}

export default function FiltersPanel({
  projects,
  statuses,
  users,
  sprints,
  filters,
  updateFilters,
  onApply
}: FiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Filtros</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          {isExpanded ? 'Menos filtros' : 'Mais filtros'}
        </button>
      </div>

      <div className="space-y-4">
        <ProjectFilter
          projects={projects}
          selectedProjects={filters.projectKeys || []}
          onChange={(projectKeys) => updateFilters({ projectKeys })}
        />

        {isExpanded && (
          <>
            <IdFilter
              selectedIds={filters.issueIds || []}
              onChange={(issueIds) => updateFilters({ issueIds })}
            />

            <StatusFilter
              statuses={statuses}
              selectedStatuses={filters.statusIds || []}
              onChange={(statusIds) => updateFilters({ statusIds })}
            />
            
            <SprintFilter
              sprints={sprints}
              selectedSprints={filters.sprintIds || []}
              onChange={(sprintIds) => updateFilters({ sprintIds })}
            />

            <AssigneeFilter
              users={users}
              selectedAssignees={filters.assigneeIds || []}
              onChange={(assigneeIds) => updateFilters({ assigneeIds })}
            />
          </>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onApply}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}