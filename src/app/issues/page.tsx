'use client';

import { useEffect } from 'react';
import { useJiraData } from '@/hooks/useJiraData';
import FiltersPanel from '@/components/filters/FiltersPanel';
import JiraTable from '@/components/table/JiraTable';
import SummaryCards from '@/components/summary/SummaryCards';
import StatusChart from '@/components/summary/StatusChart';
import AssigneeChart from '@/components/summary/AssigneeChart';

export default function Issues() {
  const { 
    issues, 
    projects, 
    statuses, 
    users, 
    sprints,
    loading, 
    error, 
    filters, 
    updateFilters, 
    loadIssues 
  } = useJiraData();

  useEffect(() => {
    // When a project is selected, load issues automatically
    if (filters.projectKeys?.length) {
      loadIssues();
    }
  }, [filters.projectKeys, loadIssues]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Issues
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visualização em tabela de todos os issues do projeto
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <FiltersPanel
        projects={projects}
        statuses={statuses}
        users={users}
        sprints={sprints}
        filters={filters}
        updateFilters={updateFilters}
        onApply={loadIssues}
      />

      {issues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Resumo
          </h2>
          <SummaryCards issues={issues} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Status</h3>
              <StatusChart issues={issues} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Responsáveis</h3>
              <AssigneeChart issues={issues} />
            </div>
          </div>
        </div>
      )}

      <JiraTable issues={issues} loading={loading} />
    </div>
  );
}