export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: {
      content: Array<{
        content: Array<{
          text: string;
          type: string;
        }>;
        type: string;
      }>;
      type: string;
    };
    status: {
      name: string;
      id: string;
      statusCategory: {
        name: string;
        colorName: string;
      };
    };
    assignee?: {
      displayName: string;
      accountId: string;
      avatarUrls: {
        '48x48': string;
      };
    };
    project: {
      id: string;
      key: string;
      name: string;
    };
    created: string;
    updated: string;
    issuetype: {
      name: string;
      iconUrl: string;
    };
    priority?: {
      name: string;
      iconUrl: string;
    };
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface FilterOptions {
  projectKeys?: string[];
  issueIds?: string[];
  statusIds?: string[];
  assigneeIds?: string[];
}