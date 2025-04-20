import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subcategory = await prisma.subCategory.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        Category: {
          select: { id: true, name: true },
        },
      },
    });

    if (!subcategory) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    return NextResponse.json(subcategory);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch subcategory.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { name, categoryId } = await req.json();

  try {
    const updated = await prisma.subCategory.update({
      where: { id: params.id },
      data: {
        name,
        categoryId: categoryId ? String(categoryId) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not update subcategory.' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.subCategory.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not delete subcategory.' }, { status: 400 });
  }
}
