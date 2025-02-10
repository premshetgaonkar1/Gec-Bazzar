import { PrismaClient } from '@prisma/client';
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";




const prisma = new PrismaClient()


//seller registers an item
const addItems= asyncHandler(async(req,res)=>{

    const{name,price,description,status,imageUrl,userId}=req.body

    if(!(name||price||status)){//add img url
        throw new apiError(400,"all the fields need to be filled")
    }

   


    const newItem  = await prisma.items.create({
        data:{
            name,
            price: parseFloat(price),
            description,
            imageUrl,
            status,
            userId
        }
    })

    if(!newItem){
        throw new apiError(500,"server side error ,item has not registered on the database")
    }

    return res.status(200).json(
        new apiResponse(200,newItem,"the item has been registered successfully")
    )


})

const fetchItems = asyncHandler(async(req,res)=>{


    const items=await prisma.items.findMany({
        where:{
            status:"AVAILABLE"
        }
    })

    console.log(items)

    if(!items){
        throw new apiError(500,"server error coulnt find the items")
    }

    return res.status(200).json(
        new apiResponse(201,items,"items fetched successfully ")
    )




})

const fetchSpecificItem= asyncHandler(async(req,res)=>{


    const{name}=req.body

    const item= await prisma.items.findUnique({
        where:{
            name:name
        }
    })

    if(!item){
        throw new apiError(400,`couldn't find ${name}`)

    }

    return res.status(200).json(
        new apiResponse(201,item,"your item was found successfully")
    )
})


const deleteItem=asyncHandler(async(req,res)=>{
    const {name}=req.body

    const item=await prisma.items.findUnique({
        where:{
            name:name
        }
    }) 
    console.log(item)

    if(!item){
        throw new apiError(400,"cannot delete an item which doesnt exist")
    }

   await prisma.items.delete({
        where:{
            name:name
        }
    })
})



export{
    addItems,
    fetchItems,
    fetchSpecificItem,
    deleteItem
}

