import { PrismaClient } from '@prisma/client';
import validator from "validator"
import bcrypt from "bcrypt"
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient();


const generateAccessToken= async(user_email)=>{

    const user=await prisma.user.findUnique({where:{email:user_email}})




    const token = jwt.sign({
        id:user.id,
        email:user.email,
        name:user.name

    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})

    return token

}

const generateRefreshToken= async(user_email)=>{

    const user=await prisma.user.findUnique({where:{email:user_email}})




    const token = jwt.sign({
        id:user.id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})

    return token

}

 const create_user= asyncHandler( async (req,res)=>{

    const {email,phone,password,name}=req.body

    if(!(email||phone||password||name)){
        // return res.status(400).json({error:"all fields are required"})

        throw new apiError(400,"all fields are required")


    }

    if(!validator.isEmail(email)){

      throw new apiError(400,"invalid email")

    }
    if(!validator.isMobilePhone(phone)){
        throw new apiError(400,"mobile number should be of 10 digits")

    }

    if(password.length<6){
       throw new apiError(400,"password should be minimum of 6 characters")
    }

    const existingUser= await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(existingUser){
        throw new apiError(400,"user already existing")
    }

    const hashedPassword =await bcrypt.hash(password,10)

        const user =await prisma.user.create({

            data:{
                email,
                phone,
                name,
                password:hashedPassword
            }

        })


        

        

        if(!user){

            throw new apiError(500,"user was not registered by server")
            
        }

        return res.status(200).json(new apiResponse(200,user,"user was created successfully"))

        

})

const loginUser= asyncHandler(async(req,res)=>{
    const {email, password}=req.body

    const user=await prisma.user.findUnique({where:{email:email}})

    if(!user){
        throw new apiError(400,"no such user exists")
    }

    //check password is correct
    //

    const isPasswordCorrect= await bcrypt.compare(password,user.password)

    if(isPasswordCorrect){

         //give access token and refresh token 

        const accessToken=await generateAccessToken(user.email)

        const refreshToken=await generateRefreshToken(user.email)

        const options={
            httpOnly:true,
            secure:true
        }

        return res
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .status(200)
        .json(new apiResponse(200,{user,accessToken,refreshToken},`welcome in ${user.name}`))
       
        
    }else{
        throw new apiError(401,"incorrect password")
        
    }
    

    

})






export {create_user,loginUser}