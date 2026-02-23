const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'products.json');
const ADMIN_PASSWORD = 'admin'; // For demo purposes

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper functions
const getProducts = () => {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const saveProducts = (products) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2));
};

// Routes
app.get('/', (req, res) => {
    const products = getProducts();
    const category = req.query.category;
    const filteredProducts = category && category !== 'All'
        ? products.filter(p => p.category === category)
        : products;

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    res.render('index', {
        products: filteredProducts,
        categories,
        selectedCategory: category || 'All',
        title: 'SmartDeals Store Hub'
    });
});

app.get('/admin', (req, res) => {
    res.render('admin', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin', { error: 'Invalid password' });
    }
});

// Mocked session/auth for simplicity
let isAdminAuthenticated = false; // In production use proper sessions

app.get('/admin/dashboard', (req, res) => {
    const products = getProducts();
    res.render('admin-dashboard', { products });
});


app.get('/keep-alive', (req, res) => {
    res.send('Ping complete');
});

cron.schedule('*/10 * * * *', async () => {
    try {
        const res = await axios.get(`https://smartdeals.onrender.com/keep-alive`);
    } catch (err) {
        console.error('Ping failed:', err.message);
    }
});

app.post('/admin/products/add', (req, res) => {
    const { name, description, price, imageUrl, affiliateLink, category } = req.body;

    if (!name || !price || !imageUrl || !affiliateLink) {
        return res.status(400).send('Missing required fields');
    }

    const products = getProducts();
    const newProduct = {
        id: uuidv4(),
        name,
        description,
        price,
        imageUrl,
        affiliateLink,
        category: category || 'General',
        clicks: 0,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    saveProducts(products);
    res.redirect('/admin/dashboard');
});

app.post('/admin/products/delete/:id', (req, res) => {
    let products = getProducts();
    products = products.filter(p => p.id !== req.params.id);
    saveProducts(products);
    res.redirect('/admin/dashboard');
});

// Click tracking
app.get('/track/:id', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);

    if (product) {
        product.clicks = (product.clicks || 0) + 1;
        saveProducts(products);
        res.redirect(product.affiliateLink);
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
