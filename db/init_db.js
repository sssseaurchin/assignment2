const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./products.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    image_url TEXT,
    categories TEXT
  );
`;

const sampleProducts = [
    ['Blue Jeans', 'Blue jeans made from 100% cotton denim.', 29.99, '/images/1.jpg', 'Unisex, Clothing, Jeans'],
    ['Red Dress', 'Red dress made from 100% polyester fabric.', 49.99, '/images/2.jpg', 'Women, Clothing, Dress'],
    ['Black Hoodie', 'Black hoodie made from 80% cotton and 20% polyester.', 39.99, '/images/3.jpg', 'Unisex, Clothing, Hoodie'],
    ['Leather Jacket', 'Leather jacket made from 100% genuine leather.', 89.99, '/images/4.jpg', 'Unisex, Clothing, Jacket'],
    ['White T-Shirt', 'White t-shirt made from 100% cotton.', 19.99, '/images/5.jpg', 'Unisex, Clothing, T-Shirt'],
    ['Grey Sweatshirt', 'Grey sweatshirt made from 60% cotton and 40% polyester.', 34.99, '/images/6.jpg', 'Unisex, Clothing, Sweatshirt'],
    ['Floral Blouse', 'Floral blouse made from 100% polyester.', 39.99, '/images/7.jpg', 'Women, Clothing, Blouse'],
    ['Black Skirt', 'Black skirt made from 95% cotton and 5% spandex.', 44.99, '/images/8.jpg', 'Women, Clothing, Skirt'],
    ['Plaid Shirt', 'Plaid shirt made from 100% cotton.', 29.99, '/images/9.jpg', 'Unisex, Clothing, Shirt'],
    ['Denim Jacket', 'Denim jacket made from 100% cotton denim.', 69.99, '/images/10.jpg', 'Unisex, Clothing, Jacket'],
    ['Sport Shorts', 'Sport shorts made from 90% polyester and 10% spandex.', 24.99, '/images/11.jpg', 'Unisex, Clothing, Shorts'],
    ['Cashmere Sweater', 'Cashmere sweater made from 100% cashmere.', 129.99, '/images/12.jpg', 'Unisex, Clothing, Sweater'],
    ['Puffer Jacket', 'Puffer jacket made from 100% nylon with polyester filling.', 99.99, '/images/13.jpg', 'Unisex, Clothing, Jacket']
];

const insertProductsQuery = `
    INSERT INTO products (name, description, price, image_url, categories)
    VALUES (?, ?, ?, ?, ?)
`;

db.run('DROP TABLE IF EXISTS products', (err) => {
    if (err) {
        console.error('Error dropping table:', err.message);
    } else {
        console.log('Dropped the products table (if it existed).');
    }

    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Products table created or already exists.');
        }

        sampleProducts.forEach((product) => {
            db.run(insertProductsQuery, product, (err) => {
                if (err) {
                    console.error('Error inserting product:', err.message);
                } else {
                    console.log(`Inserted product: ${product[0]}`);
                }
            });
        });
    });
});

db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) {
        console.error('Error checking table:', err.message);
    } else if (row.count === 0) {
        sampleProducts.forEach((product) => {
            db.run(insertProductsQuery, product, (err) => {
                if (err) {
                    console.error('Error inserting product:', err.message);
                } else {
                    console.log(`Inserted product: ${product[0]}`);
                }
            });
        });
    } else {
        console.log('Table already has data. Skipping insert.');
    }
});

db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
