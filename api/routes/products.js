const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { request } = require('../../app');
const multer = require('multer');

const storage = multer.diskStorage({
destination: function(req, file, cb){
    cb(null, './uploads/');
},
filename: function(req, file, cb){
    cb(null,  file.originalname);
}
});

const fileFilter =(req, file, cb) =>{
        //reject a file
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' ){
        cb(null, true);
    }
    else{
        cb(null, false);
    }   
}
const upload = multer({
    storage: storage,
     limits:{
    fieldSize: 1024*1024*5
},
    fileFilter:fileFilter
});

const Product = require('../models/product');


// return all products
router.get('/', (req, res, next) => {
    //There are also other functions that can be called like limit ( a limit numer), where (with a condition)
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs =>{
      const response ={
          count: docs.length,
          products: docs.map(doc =>{
              return{
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage,
                _id: doc._id,
                request:{
                    type: 'GET',
                    url:'http://localhost:3000/products/' +doc._id
                }
              }
          })
      };
            res.status(200).json(response);
       /* }
        else{
           res.status(404).json({
               message: "No entries found"
           });
       } */
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});
// create an object
router.post("/", upload.single('productImage'), (req, res, next) => {
   // console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    //save - store the information in db
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfuly',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request:{
                    type: 'GET',
                    url:'http://localhost:3000/products/' +result._id
                }
            }
        });
    })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        });

});
// return the product with id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From db",doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                  //  description: 'Get all products',
                    url:'http://localhost:3000/products'
                }
            });
        }else{
            res.status(404).json({
                message: "No valid entry found for provided ID"
            });
        }
       
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
//update an object
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps ={};
    for( const ops of req.body){
        updateOps[ops.propName] =ops.value;
    }
    Product.updateOne({_id: id}, 
    {$set: updateOps})
    .exec()
    .then(result =>{ 
       // console.log(result);
        res.status(200).json({
            message: 'Product updated',
            url:'http://localhost:3000/products/' + id
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// delete an object
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // remove the product with this criteria (in this case with this id)
    Product.remove({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/products/',
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err =>
        {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
    
});

module.exports = router;