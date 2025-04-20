import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const [subcategories, total] = await Promise.all([
      prisma.subCategory.findMany({
        skip,
        take: limit,
        orderBy: { name: 'desc' },
        select: {
          id: true,
          name: true,
          Category: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.subCategory.count(),
    ]);

    return NextResponse.json({
      data: subcategories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch paginated subcategories.' }, { status: 500 });
  }
}
