const User = require('../models/user-model');
//home page//

const home = async(req,res)=>{
    try {
        res.status(200).send('Login Page');
    } catch (error) {
        console.log(error);
        
    }
}
//register page
const register = async(req,res)=>{
    try {
         console.log(req.body)
        const {username, email, phone, password} = req.body;

        const userExiat = await User.findOne({email :email});
        if(userExiat){
            return res.status(400).json({message : "User email already exists"})
        }
        const userCreate = await User.create({
            username,
            email,
            phone,
            password,
        });
        res.status(201).json({message : userCreate})
        const data = await User.find


        res.status(200).json({data});
    } catch (error) {
        console.log(error);
    }
}
module.exports = { home , register};