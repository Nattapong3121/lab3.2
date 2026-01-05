const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

// Mideeleware

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT || 3000;

//services target

const USER_SERVICE_URL = 'http://localhost:3001';
const PRODUCT_SERVICE_URL = 'http://localhost:3002';

app.get('/products', (req, res) => {
    res.json({
        service: 'API Gateway',
        status: 'API Gateway is running',
        route: {
            "/api/users": USER_SERVICE_URL,
            "/api/products": PRODUCT_SERVICE_URL
        },
        timestamp: new Date().toISOString()
    });
});

//Proxy routes
app.use('/api/users', createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' }
}));

app.use('/api/products', createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/products': '' }
}));

//handle errors
app.use((req, res, next) => res.json({ message: 'Route not found' }));

//start server
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});





