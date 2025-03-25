import { FilterOptions, JiraIssue, JiraProject } from '@/types/jira';

// These environment variables are only available on the server
const API_URL = process.env.JIRA_API_URL;
const API_TOKEN = process.env.JIRA_API_TOKEN;
const USER_EMAIL = process.env.JIRA_USER_EMAIL;

// Define types for Jira API responses
export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    key: string;
    name: string;
    colorName: string;
  };
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls: {
    [key: string]: string;
  };
  active: boolean;
}

// Basic auth using Buffer for base64 encoding (server-side only)
const getHeaders = () => ({
  'Authorization': `Basic ${Buffer.from(`${USER_EMAIL}:${API_TOKEN}`).toString('base64')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
});

export async function fetchProjects(): Promise<JiraProject[]> {
  try {
    const response = await fetch(`${API_URL}/project`, { 
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch projects: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function fetchIssues(filters: FilterOptions): Promise<JiraIssue[]> {
  try {
    // Build JQL query from filters
    let jql = '';
    
    if (filters.projectKeys?.length) {
      jql += `project IN (${filters.projectKeys.join(',')}) `;
    }
    
    if (filters.issueIds?.length) {
      jql += jql ? 'AND ' : '';
      jql += `key IN (${filters.issueIds.join(',')}) `;
    }
    
    if (filters.statusIds?.length) {
      jql += jql ? 'AND ' : '';
      jql += `status IN (${filters.statusIds.join(',')}) `;
    }
    
    if (filters.assigneeIds?.length) {
      if (filters.assigneeIds.includes('unassigned')) {
        jql += jql ? 'AND ' : '';
        jql += 'assignee IS EMPTY ';
      } else {
        jql += jql ? 'AND ' : '';
        jql += `assignee IN (${filters.assigneeIds.map(id => `"${id}"`).join(',')}) `;
      }
    }
    
    const url = `${API_URL}/search`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        jql: jql || 'order by created DESC',
        maxResults: 100,
        fields: [
          'summary',
          'description',
          'status',
          'assignee',
          'project',
          'created',
          'updated',
          'issuetype',
          'priority'
        ]
      }),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch issues: ${response.statusText}`);
    const data = await response.json();
    return data.issues || [];
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
}

export async function fetchStatuses(): Promise<JiraStatus[]> {
  try {
    const response = await fetch(`${API_URL}/status`, { 
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch statuses: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw error;
  }
}

export async function fetchUsers(projectKey?: string): Promise<JiraUser[]> {
  try {
    // This endpoint might differ based on your Jira version/permissions
    const url = projectKey 
      ? `${API_URL}/user/assignable/search?project=${projectKey}`
      : `${API_URL}/users/search`;
      
    const response = await fetch(url, { 
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}