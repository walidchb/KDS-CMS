const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma.cjs');

// GET /api/categories — Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'desc' },
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// GET /api/categories/pagination — Get all categories with pagination
router.get('/pagination', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
  
    const skip = (page - 1) * limit;
  
    try {
      const [categories, total] = await Promise.all([
        prisma.category.findMany({
          skip,
          take: limit,
          orderBy: { name: 'desc' },
        }),
        prisma.category.count(),
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      res.json({
        data: categories,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch paginated categories.' });
    }
  });
  

// GET /api/categories/:id — Get one category
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: String(id) },
    });

    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
});

// POST /api/categories — Create category
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: 'Could not create category.' });
  }
});

// PUT /api/categories/:id — Update category
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log('id:', id);
  try {
    const updated = await prisma.category.update({
      where: { id: String(id) },
      data: { name },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not update category.' });
  }
});

// DELETE /api/categories/:id — Delete category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id: String(id) },
    });
    res.status(200).end(); 
  } catch (err) {
    res.status(400).json({ error: 'Could not delete category.' });
  }
});

module.exports = router;
