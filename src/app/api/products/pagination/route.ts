import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const name = searchParams.get('name');
  const categoryId = searchParams.get('categoryId');
  const subCategoryId = searchParams.get('subCategoryId');

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where: {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(categoryId && { categoryId }),
          ...(subCategoryId && { subCategoryId }),
        },
        orderBy: { name: 'desc' },
        select: {
          id: true,
          ref: true,
          name: true,
          specName: true,
          description: true,
          ListDescription: { select: { description: true } },
          Category: { select: { id: true, name: true } },
          SubCategory: { select: { id: true, name: true } },
          DynamicProduct: { select: { fields: true } },
          ImageProduct: { select: { image: true } },
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
      }),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch paginated products.' }, { status: 500 });
  }
}
