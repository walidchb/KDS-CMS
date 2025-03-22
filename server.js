const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const categoryRoutes = require('./routes/category');
const subcategoryRoutes = require('./routes/subcategory');
const productRoutes = require('./routes/product');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  // Mount route modules
  server.use('/api/categories', categoryRoutes);
  server.use('/api/subcategories', subcategoryRoutes);
  server.use('/api/products', productRoutes);

  // Let Next.js handle everything else
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
