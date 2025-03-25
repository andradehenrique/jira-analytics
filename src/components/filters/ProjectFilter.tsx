'use client';

import React from 'react';
import { JiraProject } from '@/types/jira';

interface ProjectFilterProps {
  projects: JiraProject[];
  selectedProjects: string[];
  onChange: (projectKeys: string[]) => void;
}

export default function ProjectFilter({ 
  projects, 
  selectedProjects, 
  onChange 
}: ProjectFilterProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Projeto
      </label>
      <select
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        value={selectedProjects[0] || ''}
        onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
      >
        <option value="">Selecione um projeto</option>
        {projects.map((project) => (
          <option key={project.id} value={project.key}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}