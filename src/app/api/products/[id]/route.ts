import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import uploadImageToCloudinary from '@/utils/uploadImageToCloudinary';

// -------- GET PRODUCT BY ID --------
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        ref: true,
        name: true,
        specName: true,
        description: true,
        ListDescription: { select: { id: true, description: true } },
        Category: { select: { id: true, name: true } },
        SubCategory: { select: { id: true, name: true } },
        DynamicProduct: { select: { fields: true } },
        ImageProduct: { select: { image: true } },
        stepOne: true,
        stepTwo: true,
        stepThree: true,
        stepFour: true,
        customImages: {
          select: {
            customImage: {
              select: {
                id: true,
                name: true,
                image: true,
                type: true,
              },
            },
          },
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

// -------- PATCH UPDATE PRODUCT --------
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await req.formData();

  const product = await prisma.product.findUnique({ where: { id } });

  const name = formData.get('name')?.toString() ?? product?.name;
  const ref = formData.get('ref')?.toString() ?? product?.ref;
  const specName = formData.get('specName')?.toString() ?? product?.specName;
  const description = formData.get('description')?.toString() ?? product?.description;
  const categoryId = formData.get('categoryId')?.toString() ?? product?.categoryId;
  const subCategoryId = formData.get('subCategoryId')?.toString() ?? product?.subCategoryId;
  const listDescription = JSON.parse(formData.get('listDescription')?.toString() ?? '[]');
  const stepOne = formData.get('stepOne')?.toString() ?? '';
  const stepTwo = formData.get('stepTwo')?.toString() ?? '';
  const stepThree = formData.get('stepThree')?.toString() ?? '';
  const stepFour = formData.get('stepFour')?.toString() ?? '';

  const characteristicImages = JSON.parse(formData.get('characteristicImages')?.toString() ?? '[]') || [];
  const machineImages = JSON.parse(formData.get('machineImages')?.toString() ?? '[]') || [];

  let fields = formData.get('fields')?.toString();
  const files = formData.getAll('images') as File[];

  if (fields) {
    try {
      fields = JSON.parse(fields);
    } catch (error) {
      console.error('Error parsing fields:', error);
      fields = '[]';
    }
  } else {
    fields = '[]';
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        ref,
        specName,
        description,
        categoryId: categoryId || undefined,
        subCategoryId: subCategoryId || undefined,
        stepOne,
        stepTwo,
        stepThree,
        stepFour,
      },
    });

    // Update ListDescription
    if (Array.isArray(listDescription)) {
      await prisma.listDescription.deleteMany({ where: { productId: id } });
      await prisma.listDescription.createMany({
        data: listDescription.map((desc: string) => ({
          productId: id,
          description: desc,
        })),
      });
    }

    // Update Dynamic Fields
    if (fields && fields !== '[]') {
      await prisma.dynamicProduct.deleteMany({ where: { productId: id } });
      await prisma.dynamicProduct.create({
        data: {
          productId: id,
          fields,
        },
      });
    }

    // Update Product Images
    if (files.length > 0) {
      await prisma.imageProduct.deleteMany({ where: { productId: id } });

      for (const file of files) {
        if (!(file instanceof File) || file.size === 0) {
          return NextResponse.json({ error: 'One or more files are invalid' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const imageUrl = await uploadImageToCloudinary(buffer);

        await prisma.imageProduct.create({
          data: {
            productId: id,
            image: imageUrl,
          },
        });
      }
    }

    // Update Custom Images
    await prisma.productCustomImage.deleteMany({ where: { productId: id } });

    const customImagesData = [
      ...characteristicImages.map((customImageId: string) => ({
        productId: id,
        customImageId,
      })),
      ...machineImages.map((customImageId: string) => ({
        productId: id,
        customImageId,
      })),
    ];

    if (customImagesData.length > 0) {
      await prisma.productCustomImage.createMany({ data: customImagesData });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not update product.' }, { status: 400 });
  }
}


// -------- DELETE PRODUCT --------
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Delete related data
    await prisma.dynamicProduct.deleteMany({ where: { productId: id } });
    await prisma.imageProduct.deleteMany({ where: { productId: id } });
    await prisma.listDescription.deleteMany({ where: { productId: id } });
    await prisma.productCustomImage.deleteMany({ where: { productId: id } });

    // Delete product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not delete product.' }, { status: 400 });
  }
}
