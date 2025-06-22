import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import uploadImageToCloudinary from '@/utils/uploadImageToCloudinary';

// GET products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const categoryId = searchParams.get('categoryId');
  const subCategoryId = searchParams.get('subCategoryId');

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(name && {
          name: { contains: name, mode: 'insensitive' },
        }),
        ...(categoryId && { categoryId }),
        ...(subCategoryId && { subCategoryId }),
      },
      orderBy: { name: 'desc' },
      select: {
        id: true,
        ref:true,
        name: true,
        specName  : true,
        description: true,
        ListDescription: { select: { description: true } },
        Category: { select: { id: true, name: true } },
        SubCategory: { select: { id: true, name: true } },
        DynamicProduct: { select: { fields: true } },
        ImageProduct: { select: { image: true } },
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

// POST create product
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get('name')?.toString() ?? '';
  const ref = formData.get('ref')?.toString() ?? '';
  const specName = formData.get('specName')?.toString() ?? '';
  const description = formData.get('description')?.toString() ?? '';
  const categoryId = formData.get('categoryId')?.toString() || null;
  const subCategoryId = formData.get('subCategoryId')?.toString() || null;
  const listDescription = JSON.parse(formData.get('listDescription')?.toString() ?? '[]') || [];
  const fields = JSON.parse(formData.get('fields')?.toString() ?? '[]') || [];
  const files = formData.getAll('images') as File[];

  try {
    const product = await prisma.product.create({
      data: {
        ref,
        name,
        specName,
        description,
        categoryId,
        subCategoryId,
      },
    });

    if (fields.length > 0) {
      await prisma.dynamicProduct.create({
        data: {
          productId: product.id,
          fields,
        },
      });
    }

    if (listDescription.length > 0) {
      await prisma.listDescription.createMany({
        data: listDescription.map((desc: string) => ({
          productId: product.id,
          description: desc,
        })),
      });
    }

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: 'One or more files are invalid' }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const imageUrl = await uploadImageToCloudinary(buffer);

      await prisma.imageProduct.create({
        data: {
          productId: product.id,
          image: imageUrl,
        },
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not create product.' }, { status: 400 });
  }
}
