const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// return all products
router.get('/', (req, res, next) => {
    //There are also other functions that can be called like limit ( a limit numer), where (with a condition)
    Product.find().exec().then(docs =>{
        console.log(docs);
        //if(docs.length >=0){
            res.status(200).json(docs);
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
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    //save - store the information in db
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST request to /products',
            createdProduct: result
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
    .exec()
    .then(doc => {
        console.log("From db",doc);
        if(doc){
            res.status(200).json(doc);
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
        console.log(result);
        res.status(200).json(result);
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
        res.status(200).json(result)
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