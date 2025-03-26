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

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
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

// Garantindo que o campo de sprint seja incluído na busca de issues

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
    
    // Add sprint filter if provided
    if (filters.sprintIds?.length) {
      jql += jql ? 'AND ' : '';
      jql += `sprint IN (${filters.sprintIds.join(',')}) `;
    }
    
    // Descubra o ID do campo customizado Sprint
    const fieldsUrl = `${API_URL}/field`;
    const fieldsResponse = await fetch(fieldsUrl, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!fieldsResponse.ok) throw new Error(`Failed to fetch fields: ${fieldsResponse.statusText}`);
    const fields = await fieldsResponse.json();
    
    // Encontra o campo Sprint na lista de campos
    const sprintField = fields.find(field => 
      field.name === "Sprint" && 
      field.schema?.custom?.includes("com.pyxis.greenhopper.jira:gh-sprint")
    );
    
    const sprintFieldId = sprintField?.id || "customfield_10104"; // Fallback para um ID comum

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
          'priority',
          sprintFieldId // Usa o ID do campo Sprint descoberto
        ]
      }),
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch issues: ${response.statusText}`);
    const data = await response.json();
    
    // Processa as issues para normalizar o campo de sprint
    const issues = data.issues || [];
    return issues.map(issue => {
      // Se tiver dados de sprint no campo customizado, mapeia para o campo 'sprint' padronizado
      if (issue.fields[sprintFieldId]) {
        const sprintArray = Array.isArray(issue.fields[sprintFieldId]) 
          ? issue.fields[sprintFieldId]
          : [issue.fields[sprintFieldId]];
          
        if (sprintArray.length > 0) {
          // Ordena as sprints por data para processamento correto
          const validSprints = sprintArray.filter(s => s && s.id);
          
          // Concatena todos os nomes de sprints
          const allSprintNames = validSprints.map(s => s.name).join(', ');
          
          // Encontra a sprint com a data de início mais antiga
          let earliestSprint = validSprints[0];
          validSprints.forEach(sprint => {
            if (sprint.startDate && (!earliestSprint.startDate || new Date(sprint.startDate) < new Date(earliestSprint.startDate))) {
              earliestSprint = sprint;
            }
          });
          
          // Encontra a sprint com a data de término mais recente
          let latestSprint = validSprints[0];
          validSprints.forEach(sprint => {
            if (sprint.endDate && (!latestSprint.endDate || new Date(sprint.endDate) > new Date(latestSprint.endDate))) {
              latestSprint = sprint;
            }
          });
          
          // Usa a sprint mais recente para informações de estado e completeDate
          const mostRecentSprint = validSprints.sort((a, b) => {
            // Se não há data de atualização, considere a mais antiga
            if (!a.startDate) return 1;
            if (!b.startDate) return -1;
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          })[0];
          
          // Normaliza para o formato esperado pela aplicação
          issue.fields.sprint = {
            id: mostRecentSprint.id,
            name: allSprintNames, // Todos os nomes concatenados
            state: mostRecentSprint.state,
            startDate: earliestSprint.startDate, // Data de início mais antiga
            endDate: latestSprint.endDate, // Data de término mais recente
            completeDate: mostRecentSprint.completeDate
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

// Atualizando a função fetchSprints para usar o endpoint correto do Jira

export async function fetchSprints(projectKey?: string): Promise<JiraSprint[]> {
  try {
    if (!projectKey) {
      return [];
    }
    
    // Primeiro, precisamos obter o ID do board associado ao projeto
    const boardsUrl = `${API_URL}/agile/1.0/board?projectKeyOrId=${projectKey}`;
    const boardsResponse = await fetch(boardsUrl, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!boardsResponse.ok) throw new Error(`Failed to fetch boards: ${boardsResponse.statusText}`);
    const boardsData = await boardsResponse.json();
    
    // Se não encontrar boards, retorna array vazio
    if (!boardsData.values || boardsData.values.length === 0) {
      return [];
    }
    
    // Usa o primeiro board encontrado (geralmente o principal do projeto)
    const boardId = boardsData.values[0].id;
    
    // Agora obtém as sprints desse board
    const sprintsUrl = `${API_URL}/agile/1.0/board/${boardId}/sprint?state=active,closed,future`;
    const sprintsResponse = await fetch(sprintsUrl, {
      headers: getHeaders(),
      cache: 'no-store'
    });
    
    if (!sprintsResponse.ok) throw new Error(`Failed to fetch sprints: ${sprintsResponse.statusText}`);
    const sprintsData = await sprintsResponse.json();
    
    return sprintsData.values || [];
  } catch (error) {
    console.error('Error fetching sprints:', error);
    throw error;
  }
}