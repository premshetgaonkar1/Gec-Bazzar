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


    const{id}=req.params

    const item= await prisma.items.findUnique({
        where:{
            id:id
        }
    })

    if(!item){
        throw new apiError(400,`couldn't find ${item.name}`)

    }

    return res.status(200).json(
        new apiResponse(201,item,"your item was found successfully")
    )
})


const deleteItem=asyncHandler(async(req,res)=>{
    const {id}=req.params

    const item=await prisma.items.findUnique({
        where:{
            id:id
        }
    }) 
    console.log(item)

    if(!item){
        throw new apiError(400,"cannot delete an item which doesnt exist")
    }

   await prisma.items.delete({
        where:{
            id:id
        }
    })
    return res.status(200).json(
        new apiResponse(201,item,"deleted successfully")
    )
})

const updateItem=asyncHandler(async(req,res)=>{

    //since status is changed on separate controller just check again 
    const{id}=user.params
    const{description,price,status}=req.body
    

    const updatedData={}
    if(description!==undefined)updatedData.description=description
    if(price!==undefined)updatedData.price=price
    if(status!==undefined)updatedData.status=status

    if(!id){
        throw new apiError(400,"enter the id of the item you want to edit")
    }

    const updatedItem=await prisma.items.update({
        where:{
            id:id
        },
        data:updatedData,
            
        
        
    })
    
    if(!updatedItem){
        throw new apiError(400,"the fields havent been updated ")
    }

    return res.status(200).json(
        new apiResponse(200,updatedItem,"the item has been successfully updated")
    )
    


})

const markItemAsSold=asyncHandler(async(req,res)=>{

    const{id}=req.params
    const{status}=req.body

    const sellerId=req.user.id

   
    if(!id){
        throw new apiError(400,"enter the id of the item you want to edit")
    }

    const updatedItem=await prisma.items.update({
        where:{
            id:id
        },
        data:{
            status:status
        },
            
        
        
    })
    
    if(!updatedItem){
        throw new apiError(400,"the fields havent been updated ")
    }

    if(updatedItem.userId!==sellerId){
        throw new apiError(403,"unauthorized to change the status of this item")
    }

    

    return res.status(200).json(
        new apiResponse(200,updatedItem,"the item has been successfully updated")
    )
    


})







export{
    addItems,
    fetchItems,
    fetchSpecificItem,
    deleteItem,
    updateItem,
    markItemAsSold
}

