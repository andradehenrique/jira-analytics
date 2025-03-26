import '@/app/globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jira Analytics',
  description: 'Analytics dashboard for Jira issues',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 dark:bg-gray-950">
        <nav className="bg-indigo-600 dark:bg-indigo-800 text-white shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="text-white text-2xl font-bold">
                    Jira Analytics
                  </Link>
                </div>
                <div className="ml-6 flex items-center space-x-4">
                  <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                    Dashboard
                  </Link>
                  <Link href="/issues" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                    Issues
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <footer className="bg-white dark:bg-gray-900 shadow-inner mt-8">
          <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              Jira Analytics Dashboard © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}