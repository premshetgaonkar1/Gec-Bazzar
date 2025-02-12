import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';

 const verifyToken= asyncHandler(async(req,res,next)=>{
    try {
        const token =req.cookies?.accessToken

       
    
        if(!token){
            throw new apiError(401,"unauthorized request")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        if(!decodedToken){
            throw new apiError(500,"couldnt decode the token")
        }
    
        req.user= decodedToken

        // console.log("this is the decoded token ",decodedToken)
    
        next()

    } catch (error) {
        throw new apiError(400,error?.message||"invalid access token ")
        
    }


})


const verifySeller=asyncHandler(async(req,res,next)=>{

    // const accessToken=req.cookies?.accessToken

    

    // const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    // if(!decodedToken){
    //     throw new apiError(401,"unauthorized access")
    // }

    console.log(req.user)

    if(!req.user){
        throw new apiError(401,"unauthorized request")
    }
    

    if(req.user.role!=="SELLER"){
        throw new apiError(403,"you are not an authorized seller")
    }

    next()



})

export{verifyToken,verifySeller}
