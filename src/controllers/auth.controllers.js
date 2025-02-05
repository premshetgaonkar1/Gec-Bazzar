import { PrismaClient } from '@prisma/client';
import validator from "validator"
import bcrypt from "bcrypt"


const prisma = new PrismaClient();

 async function create_user(req,res){

    const {email,phone,password,name}=req.body

    if(!(email||phone||password||name)){
        return res.status(400).json({error:"all fields are required"})
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({error:"invalid email"})

    }
    if(!validator.isMobilePhone(phone)){
        return res.status(400).json({error:"invalid phone number"})

    }

    if(password.length<6){
        return res.status(400).json({error:"password must be atleast 6 letters"})
    }

    const hashedPassword =await bcrypt.hash(password,10)

    try {

        const user =await prisma.user.create({

            data:{
                email,
                phone,
                name,
                password:hashedPassword
            }

        })

        console.log(user)

        return res.status(200).json({message:"user created successfully",user})

        
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({error:"internal server error"})
        
    }





}

export {create_user}