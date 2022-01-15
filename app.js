const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

//Routes which should handle request
//app use request, response, next
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// If we have the 404 error the app will go on this function
app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
//else it will go here
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });
});

module.exports = app;