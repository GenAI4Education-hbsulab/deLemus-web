import { openai } from '@/app/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const thread = await openai.beta.threads.create();
    return NextResponse.json({ threadId: thread.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Failed to create thread', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}