export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { Entry } from '@/app/types/entry';

export const POST = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  const token = process.env.API_SECRET_TOKEN;
  if (!authHeader || authHeader !== `Bearer ${token}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const session = await prisma.hamsterSession.create({
      data: {
        images: data.images ?? [],
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        rotationLog: {
          create: (data.rotationLog ?? []).map((entry: Entry) => ({
            timestamp: entry.timestamp,
            temperature: entry.temperature ?? 0,
            humidity: entry.humidity ?? 0,
          })),
        },
      },
      include: { rotationLog: true },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create session', details: error },
      { status: 400 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: Prisma.HamsterSessionWhereInput = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day to include the entire day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    const sessions = await prisma.hamsterSession.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { rotationLog: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sessions', details: error },
      { status: 400 },
    );
  }
};
