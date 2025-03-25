'use client';

import React from 'react';
import { JiraIssue } from '@/types/jira';

interface SummaryCardsProps {
  issues: JiraIssue[];
}

export default function SummaryCards({ issues }: SummaryCardsProps) {
  // Count issues by status
  const statusCount = issues.reduce<Record<string, number>>((acc, issue) => {
    const status = issue.fields.status.name;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Count issues by assignee
  const assigneeCount = issues.reduce<Record<string, number>>((acc, issue) => {
    const assignee = issue.fields.assignee?.displayName || 'Não atribuído';
    acc[assignee] = (acc[assignee] || 0) + 1;
    return acc;
  }, {});

  // Count by issue type
  const typeCount = issues.reduce<Record<string, number>>((acc, issue) => {
    const type = issue.fields.issuetype.name;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Total de Issues</h3>
        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
          {issues.length}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Status</h3>
        <div className="space-y-2">
          {Object.entries(statusCount).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{status}</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Responsáveis</h3>
        <div className="space-y-2">
          {Object.entries(assigneeCount)
            .sort((a, b) => b[1] - a[1]) // Sort by count
            .slice(0, 5) // Show top 5
            .map(([assignee, count]) => (
              <div key={assignee} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{assignee}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}