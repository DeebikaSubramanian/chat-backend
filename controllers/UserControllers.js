const UserDetails=require("../models/UserModels");
const bcrypt=require("bcryptjs");

module.exports.register=async(req,res,next)=>{

    try {
        console.log(req.body);
    const {username,email,password}=req.body;

    const usernameCheck=await UserDetails.findOne({username});
    if(usernameCheck)
    return res.json({msg:"Username exist", status:false});
    const emailCheck=await UserDetails.findOne({email})
    if(emailCheck)
    return res.json({msg:"Email exist",status:false});
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await UserDetails.create({email,username,password:hashedPassword});
    delete user.password;
    return res.json({status:true,user})
        
    } catch (ex) {
        next(ex)
    }
    
    
};


module.exports.login=async(req,res,next)=>{

    try {
        console.log(req.body);
    const {email,password}=req.body;

    const user=await UserDetails.findOne({email});
    if(!user)
    return res.json({msg:"Invalid crendentials", status:false});
  
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid)
    return res.json({msg:"Invalid crendentials",status:false});
    delete user.password;
    
    return res.json({status:true,user})
        
    } catch (ex) {
        next(ex)
    }
    
    
};


module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await UserDetails.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

module.exports.getAllUsers=async(req,res,next)=>{

    try {
        
const users=await UserDetails.find({_id:{$ne:req.params.id}}).select([
    "email","username","avatarImage","_id"
]);
return res.json(users);
        
    } catch (ex) {
        next(ex)
    }    
    
};