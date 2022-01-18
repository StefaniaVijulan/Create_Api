const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://createapi1:' +
process.env.MONGO_ATLAS_PW +
'@node-rest-shop.k5ykm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

mongoose.Promise = global.Promise;
app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/user",userRoutes)
//we set the api to can be used by anyone 
//(this is possible because of *)
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    //
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization");
    if(req.method ==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
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