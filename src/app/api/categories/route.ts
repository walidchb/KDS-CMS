import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'desc' },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const existingCategory = await prisma.category.findMany({
    where: { name },
  });
  if (existingCategory) {
    return NextResponse.json({ error: 'Category already exists.' }, { status: 400 });
  }
  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not create category.' }, { status: 400 });
  }
}
