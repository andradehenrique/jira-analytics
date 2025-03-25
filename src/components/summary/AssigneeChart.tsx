'use client';

import React from 'react';
import { JiraIssue } from '@/types/jira';

interface AssigneeChartProps {
  issues: JiraIssue[];
}

export default function AssigneeChart({ issues }: AssigneeChartProps) {
  // Count issues by assignee
  const assigneeCount = issues.reduce<Record<string, number>>((acc, issue) => {
    const assignee = issue.fields.assignee?.displayName || 'Não atribuído';
    acc[assignee] = (acc[assignee] || 0) + 1;
    return acc;
  }, {});

  // Sort by count and take top 5
  const topAssignees = Object.entries(assigneeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Calculate total for percentage
  const total = issues.length;

  // Generate color array (evenly distributed)
  const colors = [
    'bg-blue-500', 
    'bg-indigo-500', 
    'bg-purple-500', 
    'bg-pink-500', 
    'bg-red-500'
  ];

  return (
    <div className="space-y-4">
      {topAssignees.map(([assignee, count], index) => {
        const percentage = Math.round((count / total) * 100);
        const color = colors[index % colors.length];
        
        return (
          <div key={assignee}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {assignee}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {count} ({percentage}%)
              </span>
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