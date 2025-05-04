import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const subcategories = await prisma.subCategory.findMany({
      where: { categoryId: id },
      select: {
        id: true,
        name: true,
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!subcategories || subcategories.length === 0) {
      return NextResponse.json({ error: 'No subcategories found' }, { status: 404 });
    }

    return NextResponse.json(subcategories);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch subcategories.' }, { status: 500 });
  }
}
