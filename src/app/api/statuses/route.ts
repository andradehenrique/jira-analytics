import { NextResponse } from 'next/server';
import { fetchStatuses } from '@/lib/jira-api';

export async function GET() {
  try {
    const statuses = await fetchStatuses();
    return NextResponse.json(statuses);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statuses' },
      { status: 500 }
    );
  }
}