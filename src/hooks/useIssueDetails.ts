'use client';

import { useState, useEffect } from 'react';
import { JiraIssue } from '@/types/jira';

export default function useIssueDetails(issueKey: string) {
  const [issue, setIssue] = useState<JiraIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ issueIds: [issueKey] }),
        });
        
        if (!response.ok) throw new Error(`Failed to fetch issue: ${response.statusText}`);
        
        const issues = await response.json();
        if (issues && issues.length > 0) {
          setIssue(issues[0]);
          setError(null);
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        setError('Failed to load issue details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (issueKey) {
      fetchIssueDetails();
    }
  }, [issueKey]);

  return { issue, loading, error };
}