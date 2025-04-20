import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  // const { params } = context;
  const { id } = context.params; // access params inside the function


  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        ListDescription: {
          select: {
            id: true,
            description: true,
          },
        },
        Category: {
          select: { id: true, name: true },
        },
        SubCategory: {
          select: { id: true, name: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { name, description, image, categoryId, subCategoryId } = await req.json();

  try {
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        image,
        categoryId: categoryId ? String(categoryId) : undefined,
        subCategoryId: subCategoryId ? String(subCategoryId) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not update product.' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not delete product.' }, { status: 400 });
  }
}
