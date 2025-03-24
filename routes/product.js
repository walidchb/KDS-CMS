const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');
const uploadImageToCloudinary = require('../utils/uploadImageToCloudinary');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // saves files to /uploads



// GET /api/products — Get all products with relations
router.get('/', async (req, res) => {
  const { name, categoryId, subCategoryId } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(name && {
            name: {
            contains: name,
            mode: 'insensitive',
            },
        }),
        ...(categoryId && { categoryId: String(categoryId) }),
        ...(subCategoryId && { subCategoryId: String(subCategoryId) }),
        }, 

      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        ListDescription: {
          select: {
            description: true,
          },
        },
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
        SubCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products/pagination?page=1&limit=20
router.get('/pagination', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const { name, categoryId, subCategoryId } = req.query;


  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where: {
            ...(name && {
                name: {
                contains: name,
                mode: 'insensitive',
                },
            }),
            ...(categoryId && { categoryId: String(categoryId) }),
            ...(subCategoryId && { subCategoryId: String(subCategoryId) }),
            }, 
        orderBy: { name: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          ListDescription: {
            select: {
              description: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
          SubCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.product.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch paginated products.' });
  }
});

// GET /api/products/:id — Get single product with relations
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
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
          select: {
            id: true,
            name: true,
          },
        },
        SubCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// POST /api/products — Create product
router.post('/',upload.single('image'), async (req, res) => {
  const {
    name,
    description,
    categoryId,
    subCategoryId,
    ListDescription,
    fields,
  } = req.body;


  const category = await prisma.category.findUnique({
    where: { id: String(categoryId) }
  });
  const subcategory = await prisma.subCategory.findUnique({
    where: { id: String(subCategoryId) , categoryId: String(categoryId) } 
  });
 
  if (!category || !subcategory) {
    return res.status(404).json({ error: 'Category or SubCategory not found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = await uploadImageToCloudinary(req.file.path);
  // ...save to DB

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        image: imageUrl,
        categoryId: String(categoryId),
        subCategoryId: String(subCategoryId),
        ListDescription: {
          create: ListDescription?.map((desc) => ({ description: desc })),
        },
      },
    });

    if (fields.length === 0) {
      const dynamicProduct = await prisma.dynamicProduct.create({
        data: {
          fields: fields,
          productId: newProduct.id,
        },
      });
    }

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not create product.' });
  }
});

// PUT /api/products/:id — Update product
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    image,
    categoryId,
    subCategoryId,
  } = req.body;

  try {
    const updated = await prisma.product.update({
      where: { id: String(id) },
      data: {
        name,
        description,
        image,
        categoryId: categoryId ? String(categoryId) : undefined,
        subCategoryId: subCategoryId ? String(subCategoryId) : undefined,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update product.' });
  }
});

// POST /api/products/:id/description — Create product list-description
router.post('/:id/description', async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
  
    try {
      const create = await prisma.listDescription.create({
        data: { productId: String(id),description },
      });
  
      res.json(create);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Could not create product-description.' });
    }
  });
// PUT /api/products/:id/description — Update product list-description
router.patch('/:id/description', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const updated = await prisma.listDescription.update({
      where: { id: String(id) },
      data: { description },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update product-description.' });
  }
});

// DELETE /api/products/:id/description — Delete product list-description
router.delete('/:id/description', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.listDescription.delete({
        where: { id: String(id) },
      });
  
      res.status(200).end();
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Could not delete product-description.' });
    }
  });


// DELETE /api/products/:id — Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: String(id) },
    });

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not delete product.' });
  }
});

// POST /api/products/:id/dynamic — Create dynamic fields for product
router.post('/:id/dynamic', async (req, res) => {
  const { id } = req.params;
  const { fields } = req.body;

  try {
    const dynamicProduct = await prisma.dynamicProduct.create({
      data: {
        fields,
        productId: String(id),
      },
    });

    res.json(dynamicProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not create dynamic fields.' });
  }
});

//GET /api/products/:id/dynamic — Get dynamic fields for product
router.get('/:id/dynamic', async (req, res) => {
  const { id } = req.params;

  try {
    const dynamic = await prisma.dynamicProduct.findUnique({
      where: { productId: String(id) },
    });

    res.json(dynamic.fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dynamic fields.' });
  }
});

// PUT /api/products/:id/dynamic — Update dynamic fields for product
router.patch('/:id/dynamic', async (req, res) => {
  const { id } = req.params;
  const { fields } = req.body;

  try {
    const updated = await prisma.dynamicProduct.update({
      where: { productId: String(id) },
      data: { fields },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update dynamic fields.' });
  }
});

// DELETE /api/products/:id/dynamic — Delete dynamic fields for product
router.delete('/:id/dynamic', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.dynamicProduct.delete({
      where: { productId: String(id) },
    });

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not delete dynamic fields.' });
  }
});

module.exports = router;
