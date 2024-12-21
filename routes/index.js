const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./db/products.db');

router.get('/', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).send('Error fetching products');
    }
    res.render('home', { products: rows });
  });
});

router.get('/search', (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.render('home', { products: [] });
  }

  db.all(
      "SELECT * FROM products WHERE categories LIKE ? OR name LIKE ?",
      [`%${query}%`, `%${query}%`],
      (err, rows) => {
        if (err) {
          console.error('Error fetching products:', err.message);
          return res.status(500).send('Error fetching products');
        }
        res.render('searchResults', { products: rows, query: query });
      }
  );
});
router.get('/product/:id', (req, res) => {
  const productId = req.params.id;

  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
    if (err) {
      console.error('Error fetching product:', err.message);
      return res.status(500).send('Error fetching product');
    }

    if (!row) {
      return res.status(404).send('Product not found');
    }

    console.log('Image URL:', row.image_url);  // Log the image URL
    res.render('productDetail', { product: row });
  });
});


module.exports = router;
