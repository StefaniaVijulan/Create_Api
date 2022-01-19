const jwt = require('jsonwebtoken');
const { token } = require('morgan');
module.exports =(req, res, next) =>{
    try{ 
        const toekn = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
   

};