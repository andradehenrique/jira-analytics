import { NextResponse } from 'next/server';
import { fetchIssues } from '@/lib/jira-api';
import { FilterOptions } from '@/types/jira';

export async function POST(request: Request) {
  try {
    const filters: FilterOptions = await request.json();
    const issues = await fetchIssues(filters);
    return NextResponse.json(issues);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}