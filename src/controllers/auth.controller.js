import cloudinary from "../lib/cloudinary.js";
import generateToken from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'

export const signup=async (req,res)=>{
  
  try {
    const {username,email,password}=req.body;
    if(!username || !email || !password ){
        return res.status(400).json({message:"All the field are required"})
    }
    if(username.length <3){
        return res.status(400).json({message:"Username lenght should be grether than 3"})
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be atleast 6 characters"})
    }

    const user= await User.findOne({email})
    if(user) return res.status(400).json({message:"Email already exists"})

    const salt= await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt)

    //get random profile image
    // const profileImage=`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&bold=true`;


    const newUser=new User({
        username,
        email,
        password:hashedPassword,
        profileImage
    })

    if(newUser){
        const token=generateToken(newUser._id,res)
        await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            profileImage:newUser.profileImage,
            createdAt:newUser.createdAt,
            message:"successfully signup!",
            token:token
        })
    }else{
        res.status(400).json({message:"Invalid user data"})
    }

  } catch (error) {
    res.status(500).json({message:"Internal server error ",error})
  }
}

export const signin=async (req,res)=>{

      
  try {
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"All the field are required"})
    }
   
    const user= await User.findOne({email})
    if(!user) return res.status(400).json({message:"Invalid credentials"})

    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Wrong Password."})
    }
    
    
    const token=generateToken(user._id,res)
    // console.log(token)
   res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    message: "successfully signIn!",
     createdAt:user.createdAt,
    token: token
});

  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

export const getUser=async (req,res)=>{
try {
    res.status(200).json(req.user)
} catch (error) {
     res.status(500).json({message:"Internal server error in getuser"})
}
}


export const logout=(req,res)=>{
    try {
     res.cookie("jwt","",{maxAge:0})
     res.status(200).json({message:"Logged out successfully."})
    } catch (error) {
    
     res.status(500).json({message:"Internal server error"})
    }
 }
export const updateProfile = async (req, res) => {
  try {
    const { profileImage } = req.body;
    const userId = req.user._id;
 console.log(profileImage.slice(0,100))
    if (!profileImage) {
      return res.status(400).json({ message: "Not Selected the profile picture" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profileImage);
    const profileImgUrl = uploadResponse.secure_url;

    const user = await User.findById(userId);

    // Corrected condition here
    if (user.profileImage && user.profileImage.includes("cloudinary")) {
      try {
        const publicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
        console.log("Deleting image with publicId:", publicId);
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }
     

    const updateProfile = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImgUrl },
      { new: true }
    );
    
    res.status(201).json({
      _id: updateProfile._id,
      username: updateProfile.username,
      email: updateProfile.email,
      profileImage: updateProfile.profileImage,
      createdAt: updateProfile.createdAt,
      message: "successfully updated profile!",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
