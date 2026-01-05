const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Sample data

let products = [
  { id: 1, name: 'Laptop', price: '10,000 baht' },
  { id: 2, name: 'Phone', price: '5,000 baht' },
];

// Routes

//check status
app.get('/user-product', (req, res) => res.json({ status: 'OK' }));

// Get all products
app.get('/products', (req, res) => res.json(products));

// Get product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        res.json(product);
    }
});

// Create a new product (POST)
app.post('/products', (req, res) => {
    const { name, price } = req.body || {};
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Update a product (PUT)
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const { name, price } = req.body || {};
    if (name) product.name = name;
    if (price) product.price = price;
    res.json(product);
});

// Delete a product (DELETE)
app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const deletedProduct = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deletedProduct[0] });
});

app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
});