'use client';

import React from 'react';
import { JiraIssue } from '@/types/jira';

interface StatusChartProps {
  issues: JiraIssue[];
}

export default function StatusChart({ issues }: StatusChartProps) {
  // Count issues by status
  const statusCount = issues.reduce<Record<string, number>>((acc, issue) => {
    const status = issue.fields.status.name;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Sort by count
  const sortedStatuses = Object.entries(statusCount)
    .sort((a, b) => b[1] - a[1]);
  
  // Calculate total
  const total = issues.length;

  return (
    <div className="space-y-4">
      {sortedStatuses.map(([status, count]) => {
        const percentage = Math.round((count / total) * 100);
        
        // Determine color based on status name (simplified)
        let color;
        if (status.toLowerCase().includes('done') || status.toLowerCase().includes('complete')) {
          color = 'bg-green-500';
        } else if (status.toLowerCase().includes('progress') || status.toLowerCase().includes('review')) {
          color = 'bg-yellow-500';
        } else if (status.toLowerCase().includes('backlog') || status.toLowerCase().includes('todo')) {
          color = 'bg-blue-500';
        } else if (status.toLowerCase().includes('block') || status.toLowerCase().includes('impediment')) {
          color = 'bg-red-500';
        } else {
          color = 'bg-indigo-500';
        }
        
        return (
          <div key={status}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`${color} h-2.5 rounded-full`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}