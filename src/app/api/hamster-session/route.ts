export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await prisma.hamsterSession.create({
      data: {
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        rotations: data.rotations,
        temperature: data.temperature,
        humidity: data.humidity,
        image: data.image || null,
      },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create session", details: error },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const selectFields = searchParams.get("fields")?.split(",");

    const where: any = {};
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const sessions = await prisma.hamsterSession.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: selectFields?.length
        ? Object.fromEntries(selectFields.map((f) => [f, true]))
        : undefined,
      orderBy: { startTime: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sessions", details: error },
      { status: 400 }
    );
  }
}
