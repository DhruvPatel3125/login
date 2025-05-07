const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

//home page//

const home = async (req, res) => {
  try {
    res.status(200).send("welcome to home page");
  } catch (error) {
    console.log(error);
  }
};
//register page
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, phone, password } = req.body;

    const userExiat = await User.findOne({ email: email });
    if (userExiat) {
      return res.status(400).json({ message: "User email already exists" });
    }

    // //hash the password
    // const saltRound = 10;
    // const hash_password = await bcrypt.hash(password, saltRound)

    const userCreate = await User.create({
      username,
      email,
      phone,
      password,
    });
    res
      .status(201)
      .json({
        message: "User registration successfully",
        token: await userCreate.generateToken(),
        userId: userCreate._id.toString(),
      });
    const data = await User.find;

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }

};


//login page

const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const userExist = await User.findOne({ email });
        if(!userExist){
            return res.status(400).json({message: "Invalid creadentiols"})
        }
        const user = await bcrypt.compare(password, userExist.password);
        if(user){
            return res.status(200).json({
                message: "Login successfully",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            })
        }else{
            return res.status(400).json({message: "Invalid email or password"})
        }

    } catch (error) {
        console.log(error);
        
    }
}
module.exports = { home, register, login};
