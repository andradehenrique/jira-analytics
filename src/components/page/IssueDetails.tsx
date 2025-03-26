'use client';

import Link from 'next/link';
import useIssueDetails from '@/hooks/useIssueDetails';

export default function IssueDetails({ issueKey }: { issueKey: string }) {
  const { issue, loading, error } = useIssueDetails(issueKey);

  // Helper to extract plain text from Jira's document format
  const renderDescription = (description: any) => {
    if (!description?.content) return 'Sem descrição';
    
    return description.content.map((block: any, blockIndex: number) => {
      if (block.type === 'paragraph') {
        return (
          <p key={blockIndex} className="mb-4">
            {block.content?.map((content: any, contentIndex: number) => (
              <span key={contentIndex}>
                {content.text}
              </span>
            ))}
          </p>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">Carregando detalhes do issue...</div>
    );
  }

  if (error || !issue) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p>{error || 'Issue não encontrado'}</p>
        <Link href="/issues" className="text-red-700 font-semibold hover:underline mt-2 inline-block">
          Voltar para lista de issues
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center">
          <Link href="/issues" className="text-indigo-600 dark:text-indigo-400 hover:underline mr-2">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {issue.key}
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {issue.fields.summary}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projeto</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {issue.fields.project.name} ({issue.fields.project.key})
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</h3>
                <div className="mt-1 flex items-center">
                  <img src={issue.fields.issuetype.iconUrl} alt={issue.fields.issuetype.name} className="h-4 w-4 mr-1" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{issue.fields.issuetype.name}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <div className="mt-1">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${issue.fields.status.statusCategory.colorName === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    issue.fields.status.statusCategory.colorName === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                    {issue.fields.status.name}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(issue.fields.created).toLocaleString()}
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Atualizado em</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {new Date(issue.fields.updated).toLocaleString()}
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Responsável</h3>
                {issue.fields.assignee ? (
                  <div className="mt-1 flex items-center">
                    <img 
                      src={issue.fields.assignee.avatarUrls['48x48']} 
                      alt={issue.fields.assignee.displayName} 
                      className="h-8 w-8 rounded-full mr-2" 
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {issue.fields.assignee.displayName}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Não atribuído
                  </p>
                )}
              </div>

              {issue.fields.sprint && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sprint</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {issue.fields.sprint.name}
                  </p>
                  <div className="flex flex-col mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Início: {new Date(issue.fields.sprint.startDate).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Fim: {new Date(issue.fields.sprint.endDate).toLocaleDateString()}
                    </span>
                    {issue.fields.sprint.state && (
                      <span className="text-xs font-medium mt-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 inline-block w-fit">
                        {issue.fields.sprint.state}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Descrição</h3>
            <div className="mt-1 prose prose-sm max-w-none text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
              {renderDescription(issue.fields.description)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}