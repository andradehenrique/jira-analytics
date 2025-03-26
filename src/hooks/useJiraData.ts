'use client';

import { useState, useEffect, useCallback } from 'react';
import { FilterOptions, JiraIssue, JiraProject } from '@/types/jira';
import { JiraStatus, JiraUser, JiraSprint } from '@/lib/jira-api';

export function useJiraData() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [statuses, setStatuses] = useState<JiraStatus[]>([]);
  const [users, setUsers] = useState<JiraUser[]>([]);
  const [sprints, setSprints] = useState<JiraSprint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Load projects, statuses on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [projectsRes, statusesRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/statuses'),
        ]);
        
        if (!projectsRes.ok || !statusesRes.ok) {
          throw new Error('Failed to load initial data');
        }
        
        const [projectsData, statusesData] = await Promise.all([
          projectsRes.json(),
          statusesRes.json(),
        ]);
        
        setProjects(projectsData);
        setStatuses(statusesData);
        setError(null);
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load users and sprints when project changes
  useEffect(() => {
    const loadProjectData = async () => {
      if (!filters.projectKeys?.length) return;
      
      setLoading(true);
      try {
        // Fetch both users and sprints in parallel
        const [usersRes, sprintsRes] = await Promise.all([
          fetch(`/api/users?projectKey=${filters.projectKeys[0]}`),
          fetch(`/api/sprints?projectKey=${filters.projectKeys[0]}`)
        ]);
        
        if (!usersRes.ok || !sprintsRes.ok) {
          throw new Error('Failed to load project data');
        }
        
        const [usersData, sprintsData] = await Promise.all([
          usersRes.json(),
          sprintsRes.json()
        ]);
        
        setUsers(usersData);
        setSprints(sprintsData);
        setError(null);
      } catch (err) {
        setError('Failed to load project data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [filters.projectKeys]);

  // Load issues when filters change
  const loadIssues = useCallback(async () => {
    if (!filters.projectKeys?.length) {
      setIssues([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      
      if (!response.ok) throw new Error('Failed to load issues');
      
      const issuesData = await response.json();
      setIssues(issuesData);
      setError(null);
    } catch (err) {
      setError('Failed to load issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters function
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
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
  };
}