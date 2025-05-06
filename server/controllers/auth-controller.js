//home page//

const home = async(req,res)=>{
    try {
        console.log(req.body)
        res.status(200).send('Login Page');
    } catch (error) {
        console.log(error);
        
    }
}
//register page
const register = async(req,res)=>{
    try {
        res.status(200).json({message:req.body});
    } catch (error) {
        console.log(error);
    }
}
module.exports = { home , register};