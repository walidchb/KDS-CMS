import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET custom image by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const customImage = await prisma.customImage.findUnique({
      where: { id },
      select: {
        id: true,
        image: true,
        name: true,
        type: true,
      },
    });

    if (!customImage) {
      return NextResponse.json({ error: 'Custom image not found' }, { status: 404 });
    }

    return NextResponse.json(customImage);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch custom image.' }, { status: 500 });
  }
}

// DELETE custom image by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.customImage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Custom image deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not delete custom image.' }, { status: 400 });
  }
}
