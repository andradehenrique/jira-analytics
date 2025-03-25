import { NextResponse } from 'next/server';
import { fetchProjects } from '@/lib/jira-api';

export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}