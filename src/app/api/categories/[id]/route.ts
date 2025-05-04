import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch category.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name } = await req.json();

  const existingCategory = await prisma.category.findMany({
    where: { name },
  });
  if (existingCategory.length>0) {
    return NextResponse.json({ error: 'Category name already exists' }, { status: 404 });
  }

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not update category.' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not delete category.' }, { status: 400 });
  }
}
