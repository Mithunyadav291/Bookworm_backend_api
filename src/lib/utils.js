import jwt from 'jsonwebtoken'

const generateToken=(userId,res)=>{
    // console.log("JWT_SECRET:",process.env.JWT_SECRET)
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
      expiresIn:"7d"
    })
    res.cookie("jwt",token,{
      maxAge:7*24*60*60*1000,//milisecond
      httpOnly:true,
      sameSite:"strict",
      secure:false,
    });
//   console.log(token)
    return token;
}


export default generateToken;