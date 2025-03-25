'use client';

import { useState, useEffect, useCallback } from 'react';
import { FilterOptions, JiraIssue, JiraProject } from '@/types/jira';
import { JiraStatus, JiraUser } from '@/lib/jira-api';

export function useJiraData() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [statuses, setStatuses] = useState<JiraStatus[]>([]);
  const [users, setUsers] = useState<JiraUser[]>([]);
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

  // Load users when project changes
  useEffect(() => {
    const loadUsers = async () => {
      if (!filters.projectKeys?.length) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/users?projectKey=${filters.projectKeys[0]}`);
        if (!response.ok) throw new Error('Failed to load users');
        
        const usersData = await response.json();
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
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
    loading,
    error,
    filters,
    updateFilters,
    loadIssues
  };
}