import { Suspense } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Jira Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visualização e análise de issues do Jira
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/issues" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 dark:bg-indigo-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Visualização de Issues
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize todas as issues do projeto em formato de tabela, com filtros por projeto, status e responsável.
            </p>
          </div>
        </Link>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 dark:bg-indigo-500 text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Estatísticas e Gráficos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Veja estatísticas de issues por status, responsável e tipo. Ideal para apresentações de status do projeto.
            </p>
          </div>
        </Suspense>
      </div>
    </div>
  );
}