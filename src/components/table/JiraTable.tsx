'use client';

import React from 'react';
import Link from 'next/link';
import { JiraIssue } from '@/types/jira';

interface JiraTableProps {
  issues: JiraIssue[];
  loading: boolean;
}

export default function JiraTable({ issues, loading }: JiraTableProps) {
  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!issues.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhum item encontrado. Ajuste os filtros e tente novamente.
      </div>
    );
  }

  // Helper to extract plain text from Jira's document format
  const getPlainTextDescription = (description: JiraIssue['fields']['description']) => {
    if (!description?.content) return '';
    return description.content
      .flatMap((item) => 
        item.content?.map((content) => content.text).filter(Boolean) || []
      )
      .join(' ')
      .substring(0, 100) + '...';
  };

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      // Formata a data explicitamente em formato pt-BR (DD/MM/AAAA)
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data inválida';
    }
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Chave
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Resumo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Responsável
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Sprint
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Início Sprint
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
              Fim Sprint
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
              Atualizado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {issues.map((issue) => (
            <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <Link href={`/issue/${issue.key}`}>{issue.key}</Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                <div className="font-medium">{issue.fields.summary}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden md:block">
                  {issue.fields.description ? 
                    getPlainTextDescription(issue.fields.description) : 
                    'Sem descrição'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${issue.fields.status.statusCategory.colorName === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  issue.fields.status.statusCategory.colorName === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                  {issue.fields.status.name}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {issue.fields.assignee ? (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <img 
                        className="h-8 w-8 rounded-full" 
                        src={issue.fields.assignee.avatarUrls['48x48']} 
                        alt={issue.fields.assignee.displayName} 
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {issue.fields.assignee.displayName}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Não atribuído</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {issue.fields.sprint ? issue.fields.sprint.name : 'Sem sprint'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {issue.fields.sprint ? formatDate(issue.fields.sprint.startDate) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                {issue.fields.sprint ? formatDate(issue.fields.sprint.endDate) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                {formatDate(issue.fields.updated)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}