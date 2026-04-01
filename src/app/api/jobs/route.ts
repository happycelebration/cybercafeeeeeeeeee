import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const jobs = await storage.getJobs();
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, lastDate, status, applyUrl } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }
    const job = await storage.createJob({
      title,
      description,
      lastDate: lastDate || null,
      status: status || 'active',
      applyUrl: applyUrl || null,
    });
    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }
    const job = await storage.updateJob(id, data);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }
    await storage.deleteJob(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
