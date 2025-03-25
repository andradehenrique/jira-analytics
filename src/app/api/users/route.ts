import { NextResponse } from 'next/server';
import { fetchUsers } from '@/lib/jira-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey') || undefined;
    
    const users = await fetchUsers(projectKey);
    return NextResponse.json(users);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}