import { PrismaClient } from '@prisma/client';
import validator from "validator"
import bcrypt from "bcrypt"
import { apiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';


const prisma = new PrismaClient();

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

export {create_user}