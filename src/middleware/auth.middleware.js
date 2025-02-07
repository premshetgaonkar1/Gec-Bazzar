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
    
        next()

    } catch (error) {
        throw new apiError(400,error?.message||"invalid access token ")
        
    }


})

export{verifyToken}
