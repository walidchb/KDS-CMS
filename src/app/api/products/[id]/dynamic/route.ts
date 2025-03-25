import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { fields } = await req.json();

  try {
    const created = await prisma.dynamicProduct.create({
      data: {
        productId: params.id,
        fields,
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not create dynamic fields.' }, { status: 400 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dynamic = await prisma.dynamicProduct.findUnique({
      where: { productId: params.id },
    });

    return NextResponse.json(dynamic?.fields || []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch dynamic fields.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { fields } = await req.json();

  try {
    const updated = await prisma.dynamicProduct.update({
      where: { productId: params.id },
      data: { fields },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not update dynamic fields.' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.dynamicProduct.delete({
      where: { productId: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not delete dynamic fields.' }, { status: 400 });
  }
}
