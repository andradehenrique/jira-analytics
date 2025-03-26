import mockJiraData from '../data/atlassiancom-jira.json';

// API configuration
const API_URL = process.env.JIRA_API_URL;
const API_TOKEN = process.env.JIRA_API_TOKEN;
const USER_EMAIL = process.env.JIRA_USER_EMAIL;

// Determine if we should use mock data
const USE_MOCK_DATA = !API_URL;

// Basic auth using Buffer for base64 encoding
const getHeaders = (): HeadersInit => {
  if (USE_MOCK_DATA) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
  
  return {
    'Authorization': `Basic ${Buffer.from(`${USER_EMAIL}:${API_TOKEN}`).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// Types for Jira API responses
export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    id: string;
    key: string;
    name: string;
    colorName: string;
  };
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  avatarUrls: {
    '48x48': string;
  };
}

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
}

// Extract endpoints from JSON file
const extractEndpoints = () => {
  // Create a map of endpoints for quick access
  const endpointMap = {};
  
  if (mockJiraData && mockJiraData.routes) {
    mockJiraData.routes.forEach(route => {
      if (route.method && route.endpoint) {
        const key = `${route.method.toLowerCase()}:${route.endpoint}`;
        endpointMap[key] = route;
      }
    });
  }
  
  return endpointMap;
};

const endpointMap = extractEndpoints();

// Mock data handling functions
const findMockEndpoint = (method: string, endpointPattern: string) => {
  // First try direct match from endpoint map
  const directKey = `${method.toLowerCase()}:${endpointPattern}`;
  if (endpointMap[directKey]) {
    return endpointMap[directKey];
  }

  // Try to find pattern match
  const routes = mockJiraData.routes || [];
  
  // For search endpoints in mock data
  if (endpointPattern.includes('search')) {
    return routes.find(route => 
      route.method.toLowerCase() === method.toLowerCase() && 
      route.endpoint.includes('search')
    );
  }
  
  // For other endpoints
  return routes.find(route => {
    const pattern = endpointPattern.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return route.method.toLowerCase() === method.toLowerCase() && 
           regex.test(route.endpoint);
  });
};

const getMockResponse = (endpoint: any) => {
  if (!endpoint || !endpoint.responses) return null;
  
  // Find a successful response (200 status code)
  const response = endpoint.responses.find((r: any) => 
    r.statusCode === 200 || r.default === true
  );
  
  if (!response) return null;
  
  try {
    // Parse the response body if it's a string
    if (typeof response.body === 'string' && response.body.trim()) {
      return JSON.parse(response.body);
    }
    return response.body;
  } catch (e) {
    console.error('Error parsing mock response:', e);
    return null;
  }
};

// Generate realistic mock data when JSON doesn't have it
const generateMockProjects = () => {
  return [
    { id: 'JIRA-10001', key: 'JIRA', name: 'Jira Core Development' },
    { id: 'CONF-10002', key: 'CONF', name: 'Confluence Project' },
    { id: 'DEVOPS-10003', key: 'DEVOPS', name: 'DevOps Initiative' },
    { id: 'ATLAS-10004', key: 'ATLAS', name: 'Atlassian Platform' }
  ];
};

const generateMockStatuses = () => {
  return [
    { 
      id: 'status-1', 
      name: 'To Do', 
      statusCategory: { id: '2', key: 'new', name: 'To Do', colorName: 'blue' } 
    },
    { 
      id: 'status-2', 
      name: 'In Progress', 
      statusCategory: { id: '4', key: 'indeterminate', name: 'In Progress', colorName: 'yellow' } 
    },
    { 
      id: 'status-3', 
      name: 'In Review', 
      statusCategory: { id: '4', key: 'indeterminate', name: 'In Progress', colorName: 'yellow' } 
    },
    { 
      id: 'status-4', 
      name: 'Done', 
      statusCategory: { id: '3', key: 'done', name: 'Done', colorName: 'green' } 
    }
  ];
};

const generateMockUsers = () => {
  return [
    { 
      accountId: 'user-5f8b3a2e9d', 
      displayName: 'John Appleseed', 
      avatarUrls: { '48x48': 'https://dummyjson.com/image/48x48' } 
    },
    { 
      accountId: 'user-7a2b1c4e5f', 
      displayName: 'Sarah Johnson', 
      avatarUrls: { '48x48': 'https://dummyjson.com/image/48x48' } 
    },
    { 
      accountId: 'user-3d8e9f1a2b', 
      displayName: 'Michael Torres', 
      avatarUrls: { '48x48': 'https://dummyjson.com/image/48x48' } 
    },
    { 
      accountId: 'unassigned', 
      displayName: 'Unassigned', 
      avatarUrls: { '48x48': 'https://dummyjson.com/image/48x48' } 
    }
  ];
};

const generateMockSprints = () => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
  
  return [
    {
      id: 101,
      name: 'January Planning Sprint',
      state: 'closed',
      startDate: new Date(twoWeeksAgo).toISOString(),
      endDate: new Date(oneWeekAgo).toISOString(),
      completeDate: new Date(oneWeekAgo).toISOString()
    },
    {
      id: 102,
      name: 'February Implementation',
      state: 'active',
      startDate: new Date(oneWeekAgo).toISOString(),
      endDate: new Date(oneWeekFromNow).toISOString()
    },
    {
      id: 103,
      name: 'March Delivery Sprint',
      state: 'future',
      startDate: new Date(oneWeekFromNow).toISOString(),
      endDate: new Date(twoWeeksFromNow).toISOString()
    }
  ];
};

const generateMockIssues = (projectKey?: string) => {
  const mockProjects = generateMockProjects();
  const project = projectKey 
    ? mockProjects.find(p => p.key === projectKey) || mockProjects[0]
    : mockProjects[0];
  
  const types = [
    { name: 'Story', iconUrl: 'https://dummyjson.com/image/24x24/63ba3c' },
    { name: 'Bug', iconUrl: 'https://dummyjson.com/image/24x24/e5493a' },
    { name: 'Task', iconUrl: 'https://dummyjson.com/image/24x24/4bade8' }
  ];
  
  const priorities = [
    { name: 'High', iconUrl: 'https://dummyjson.com/image/24x24/ff5630' },
    { name: 'Medium', iconUrl: 'https://dummyjson.com/image/24x24/ffab00' },
    { name: 'Low', iconUrl: 'https://dummyjson.com/image/24x24/0065ff' }
  ];
  
  const statuses = generateMockStatuses();
  const users = generateMockUsers();
  const sprints = generateMockSprints();
  
  return Array(15).fill(null).map((_, i) => ({
    id: `${10000 + i}`,
    key: `${project.key}-${100 + i}`,
    fields: {
      summary: `${types[i % 3].name}: Implement ${['feature', 'component', 'improvement', 'fix'][i % 4]} ${i + 1}`,
      description: {
        content: [{
          content: [{ 
            text: `This is a detailed description for ${project.key}-${100 + i}. It includes requirements and acceptance criteria.`, 
            type: 'text' 
          }],
          type: 'paragraph'
        }]
      },
      status: statuses[i % 4],
      assignee: i % 4 === 3 ? null : users[i % 3],
      project: project,
      created: new Date(Date.now() - (i * 86400000)).toISOString(),
      updated: new Date(Date.now() - (i * 43200000)).toISOString(),
      issuetype: types[i % 3],
      priority: priorities[i % 3],
      sprint: sprints[Math.floor(i / 5)]
    }
  }));
};

// API functions with mock data fallback
export async function fetchProjects(): Promise<any[]> {
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for projects');
      const endpoint = findMockEndpoint('get', 'rest/api/3/project');
      const mockResponse = getMockResponse(endpoint);
      
      // Use generated mock projects if no valid response from JSON
      if (!mockResponse || !Array.isArray(mockResponse)) {
        return generateMockProjects();
      }
      
      return mockResponse;
    }
    
    const url = `${API_URL}/project`;
    const response = await fetch(url, { 
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch projects: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function fetchIssues(filters: any): Promise<any[]> {
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
    
    if (filters.sprintIds?.length) {
      jql += jql ? 'AND ' : '';
      jql += `sprint IN (${filters.sprintIds.join(',')}) `;
    }
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for issues with JQL:', jql);
      const endpoint = findMockEndpoint('post', 'rest/api/3/search');
      let mockIssues = getMockResponse(endpoint);
      
      // Use generated mock issues if no valid response from JSON
      if (!mockIssues || !mockIssues.issues) {
        const projectKey = filters.projectKeys?.length ? filters.projectKeys[0] : undefined;
        mockIssues = {
          issues: generateMockIssues(projectKey)
        };
      }
      
      // Filter mock issues based on JQL
      let issues = mockIssues.issues || [];
      
      // Apply basic filtering based on parsed JQL
      if (filters.projectKeys?.length) {
        issues = issues.filter(issue => 
          filters.projectKeys.includes(issue.fields?.project?.key)
        );
      }
      
      if (filters.issueIds?.length) {
        issues = issues.filter(issue => 
          filters.issueIds.includes(issue.key)
        );
      }
      
      if (filters.statusIds?.length) {
        issues = issues.filter(issue => 
          filters.statusIds.includes(issue.fields?.status?.id)
        );
      }
      
      if (filters.assigneeIds?.length) {
        issues = issues.filter(issue => {
          if (filters.assigneeIds.includes('unassigned')) {
            return !issue.fields?.assignee;
          }
          return issue.fields?.assignee && 
                 filters.assigneeIds.includes(issue.fields.assignee.accountId);
        });
      }
      
      if (filters.sprintIds?.length) {
        issues = issues.filter(issue => 
          issue.fields?.sprint && 
          filters.sprintIds.includes(String(issue.fields.sprint.id))
        );
      }
      
      return issues;
    }
    
    const url = `${API_URL}/search`;
    
    // Try to find the sprint field ID
    let sprintFieldId = "customfield_10104"; // Default fallback
    try {
      const fieldsResponse = await fetch(`${API_URL}/field`, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      
      if (fieldsResponse.ok) {
        const fields = await fieldsResponse.json();
        const sprintField = fields.find((field: any) => 
          field.name === "Sprint" && 
          field.schema?.custom?.includes("com.pyxis.greenhopper.jira:gh-sprint")
        );
        
        if (sprintField?.id) {
          sprintFieldId = sprintField.id;
        }
      }
    } catch (error) {
      console.warn('Could not determine sprint field ID, using default:', error);
    }
    
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
          'priority',
          sprintFieldId
        ]
      }),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch issues: ${response.statusText}`);
    const data = await response.json();
    
    // Process issues to normalize sprint field
    const issues = data.issues || [];
    return issues.map((issue: any) => {
      // If sprint data exists in the custom field, normalize it
      if (issue.fields[sprintFieldId]) {
        const sprintArray = Array.isArray(issue.fields[sprintFieldId]) 
          ? issue.fields[sprintFieldId]
          : [issue.fields[sprintFieldId]];
          
        if (sprintArray.length > 0) {
          // Concatena todos os nomes de sprints
          const allSprintNames = sprintArray.map((s: any) => s.name).join(', ');
          
          // Encontra a sprint com a data de início mais antiga
          let earliestSprint = sprintArray[0];
          sprintArray.forEach((sprint: any) => {
            if (sprint.startDate && (!earliestSprint.startDate || new Date(sprint.startDate) < new Date(earliestSprint.startDate))) {
              earliestSprint = sprint;
            }
          });
          
          // Encontra a sprint com a data de término mais recente
          let latestSprint = sprintArray[0];
          sprintArray.forEach((sprint: any) => {
            if (sprint.endDate && (!latestSprint.endDate || new Date(sprint.endDate) > new Date(latestSprint.endDate))) {
              latestSprint = sprint;
            }
          });
          
          // Normaliza para o formato esperado pela aplicação
          issue.fields.sprint = {
            id: sprintArray[0].id,
            name: allSprintNames,
            state: sprintArray[0].state,
            startDate: earliestSprint.startDate,
            endDate: latestSprint.endDate,
            completeDate: sprintArray[0].completeDate
          };
        }
      }
      return issue;
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
}

export async function fetchStatuses(): Promise<JiraStatus[]> {
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for statuses');
      const endpoint = findMockEndpoint('get', 'rest/api/3/status');
      const mockResponse = getMockResponse(endpoint);
      
      // Use generated mock statuses if no valid response from JSON
      if (!mockResponse || !Array.isArray(mockResponse)) {
        return generateMockStatuses();
      }
      
      return mockResponse;
    }
    
    const url = `${API_URL}/status`;
    const response = await fetch(url, { 
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch statuses: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw error;
  }
}

export async function fetchUsers(projectKey?: string): Promise<JiraUser[]> {
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for users');
      // Use generated mock users since there's likely no endpoint for this in JSON
      return generateMockUsers();
    }
    
    // In real mode, we need to handle the endpoint correctly
    let url = `${API_URL}/users/search?maxResults=200`;
    if (projectKey) {
      url = `${API_URL}/user/assignable/search?project=${projectKey}&maxResults=200`;
    }
    
    const response = await fetch(url, { 
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);
    const data = await response.json();
    
    // Add an "unassigned" option
    return [...data, { 
      accountId: 'unassigned', 
      displayName: 'Unassigned', 
      avatarUrls: { '48x48': 'https://dummyjson.com/image/48x48/282828' } 
    }];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function fetchSprints(projectKey?: string): Promise<JiraSprint[]> {
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for sprints');
      // Use generated mock sprints since there's likely no endpoint for this in JSON
      return generateMockSprints();
    }
    
    if (!projectKey) {
      return [];
    }
    
    // First try to get board ID for the project
    try {
      const boardsUrl = `${API_URL}/agile/1.0/board?projectKeyOrId=${projectKey}`;
      const boardsResponse = await fetch(boardsUrl, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      
      if (!boardsResponse.ok) {
        throw new Error(`Failed to fetch boards: ${boardsResponse.statusText}`);
      }
      
      const boardsData = await boardsResponse.json();
      if (!boardsData.values || boardsData.values.length === 0) {
        console.log(`No boards found for project ${projectKey}`);
        return [];
      }
      
      // Use the first board ID
      const boardId = boardsData.values[0].id;
      console.log(`Found board ID ${boardId} for project ${projectKey}`);
      
      // Get sprints for this board
      const sprintsUrl = `${API_URL}/agile/1.0/board/${boardId}/sprint?state=active,closed,future`;
      const sprintsResponse = await fetch(sprintsUrl, {
        headers: getHeaders(),
        cache: 'no-store'
      });
      
      if (!sprintsResponse.ok) {
        throw new Error(`Failed to fetch sprints: ${sprintsResponse.statusText}`);
      }
      
      const sprintsData = await sprintsResponse.json();
      return sprintsData.values || [];
    } catch (error) {
      console.error('Error fetching sprints:', error);
      return [];
    }
  } catch (error) {
    console.error('Error in fetchSprints:', error);
    return [];
  }
}