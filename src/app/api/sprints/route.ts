import { NextResponse } from 'next/server';
import { fetchSprints } from '@/lib/jira-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey') || undefined;
    
    const sprints = await fetchSprints(projectKey);
    return NextResponse.json(sprints);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    );
  }
}