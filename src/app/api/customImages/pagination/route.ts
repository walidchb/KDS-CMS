import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const typeParam = searchParams.get('type');
  const type = typeParam ? parseInt(typeParam) : undefined;

  try {
    const [customImages, total] = await Promise.all([
      prisma.customImage.findMany({
        skip,
        take: limit,
        where: type !== undefined ? { type } : undefined,
        orderBy: { type: 'asc' },
        select: {
          id: true,
          name:true,
          image: true,
          type: true,
        },
      }),
      prisma.customImage.count({
        where: type !== undefined ? { type } : undefined,
      }),
    ]);

    return NextResponse.json({
      data: customImages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch paginated custom images.' }, { status: 500 });
  }
}
