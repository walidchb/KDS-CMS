const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');

// GET /api/subcategories — Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await prisma.subCategory.findMany({
      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
        Category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    res.json(subcategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// GET /api/subcategories/pagination — Get paginated subcategories
router.get('/pagination', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const [subcategories, total] = await Promise.all([
      prisma.subCategory.findMany({
        skip,
        take: limit,
        orderBy: { name: 'desc' },
        select: {
            id: true,
            name: true,
            Category: {
              select: {
                id: true,
                name: true
              }
            }
          }
      }),
      prisma.subCategory.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: subcategories,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch paginated subcategories.' });
  }
});

// GET /api/subcategories/:id — Get one subcategory
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subcategory = await prisma.subCategory.findUnique({
     select: {
        id: true,
        name: true,
        Category: {
            select: {
            id: true,
            name: true
            }
        }
      },
      where: { id: String(id) },
      
    });

    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategory.' });
  }
});

// GET /api/subcategories/:id/category — Get subcategories of one category
router.get('/:id/category', async (req, res) => {
    const { id } = req.params;
    try {
      const subcategory = await prisma.subCategory.findMany({
       select: {
          id: true,
          name: true,
          Category: {
              select: {
              id: true,
              name: true
              }
          }
        },
        where: { categoryId: String(id) },
        
      });
  
      if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
      res.json(subcategory);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch subcategory.' });
    }
  });

// POST /api/subcategories — Create subcategory
router.post('/', async (req, res) => {
  const { name, categoryId } = req.body;
  const category = await prisma.category.findUnique({
    where: { id: String(categoryId) } // use parseInt if id is an Int
  });
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  try {
    const newSubCategory = await prisma.subCategory.create({
      data: { name, categoryId: String(categoryId) },
    });
    res.status(201).json(newSubCategory);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not create subcategory.' });
  }
});

// PUT /api/subcategories/:id — Update subcategory
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, categoryId } = req.body;

  try {
    const updated = await prisma.subCategory.update({
      where: { id: String(id) },
      data: {
        name,
        categoryId: categoryId ? String(categoryId) : undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update subcategory.' });
  }
});

// DELETE /api/subcategories/:id — Delete subcategory
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.subCategory.delete({
      where: { id: String(id) },
    });
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not delete subcategory.' });
  }
});

module.exports = router;
