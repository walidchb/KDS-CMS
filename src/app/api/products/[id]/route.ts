import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import uploadImageToCloudinary from '@/utils/uploadImageToCloudinary';


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        description: true,
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
        DynamicProduct: { select: { fields: true } },
        ImageProduct: { select: { image: true } },
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
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  const name = formData.get('name')?.toString() ?? product?.name;
  const description = formData.get('description')?.toString() ?? product?.description;
  const categoryId = formData.get('categoryId')?.toString() ?? product?.categoryId;
  const subCategoryId = formData.get('subCategoryId')?.toString() ?? product?.subCategoryId;

  const listDescription = JSON.parse(formData.get('listDescription')?.toString() ?? '[]');
  //const fields = JSON.parse(formData.get('fields')?.toString() ?? '[]') || '[]';
  let fields = formData.get('fields')?.toString()
  const files = formData.getAll('images') as File[];

  if (fields) {
    try {
      fields = JSON.parse(fields);
    }
    catch (error) {
      console.error('Error parsing fields:', error);
      fields = '[]';
    }
  } else {
    fields = '[]';
  }
  try {
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        categoryId: categoryId ? String(categoryId) : undefined,
        subCategoryId: subCategoryId ? String(subCategoryId) : undefined,
      },
    });
    if (listDescription && listDescription != '[]') {
      if (listDescription.length > 0) {
        await prisma.listDescription.deleteMany({
          where: { productId: params.id },
        });
        await prisma.listDescription.createMany({
          data: listDescription.map((desc: string) => ({
            productId: params.id,
            description: desc,
          })),
        });
      }
    }
    if (fields && fields != '[]') {
      await prisma.dynamicProduct.delete({
        where: { productId: params.id },
      });
      await prisma.dynamicProduct.create({
        data: {
          productId: params.id,
          fields: fields,
        },
      });
    }
    if (files.length > 0) {
  
      await prisma.imageProduct.deleteMany({
        where: { productId: params.id },
      });

      for (const file of files) {
        if (!(file instanceof File) || file.size === 0) {
          return NextResponse.json({ error: 'One or more files are invalid' }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageUrl = await uploadImageToCloudinary(buffer);
        await prisma.imageProduct.createMany({
          data: {
            productId: params.id,
            image: imageUrl,
          },
        });
    
      }
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not update product.' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete related data first to avoid FK constraint errors
    await prisma.dynamicProduct.deleteMany({
      where: { productId: params.id },
    });

    await prisma.imageProduct.deleteMany({
      where: { productId: params.id },
    });

    await prisma.listDescription.deleteMany({
      where: { productId: params.id },
    });

    // Now delete the product
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not delete product.' }, { status: 400 });
  }
}

