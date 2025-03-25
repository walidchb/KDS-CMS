import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subcategories = await prisma.subCategory.findMany({
      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
        Category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(subcategories);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name, categoryId } = await req.json();

  const category = await prisma.category.findUnique({
    where: { id: String(categoryId) },
  });

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  try {
    const newSubCategory = await prisma.subCategory.create({
      data: { name, categoryId: String(categoryId) },
    });
    return NextResponse.json(newSubCategory, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not create subcategory.' }, { status: 400 });
  }
}
