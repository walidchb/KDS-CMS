import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import uploadImageToCloudinary from '@/utils/uploadImageToCloudinary';

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
        name: true,
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

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get('name')?.toString() ?? '';
  const description = formData.get('description')?.toString() ?? '';
  const categoryId = formData.get('categoryId')?.toString() ?? '';
  const subCategoryId = formData.get('subCategoryId')?.toString() ?? '';
  const listDescription = JSON.parse(formData.get('listDescription')?.toString() ?? '[]') || '[]';
  const fields = JSON.parse(formData.get('fields')?.toString() ?? '[]') || '[]';
  const files = formData.getAll('images') as File[];

  // if (!files || files.length === 0) {
  //   return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  // }


  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  const subcategory = await prisma.subCategory.findUnique({
    where: { id: subCategoryId },
  });

  if (!category || !subcategory) {
    return NextResponse.json({ error: 'Category or SubCategory not found' }, { status: 404 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        categoryId,
        subCategoryId,
      },
    });

    if (fields !=  '[]') {
      await prisma.dynamicProduct.create({
        data: {
          productId: product.id,
          fields,
        },
      });
    }

    if (listDescription != '[]') {
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
      await prisma.imageProduct.createMany({
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
