import { PrismaClient } from '@prisma/client';
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";






const prisma = new PrismaClient()


const createRequest= asyncHandler(async(req,res)=>{

    const{itemId}=req.body
    const buyerId=req.user.id



    if(!itemId){
        throw new apiError(400,"enter the item id")
    }


      // Check if the item exists and is not sold
      const item = await prisma.items.findUnique({
        where: { id: itemId }
    })

    if (!item) {
        throw new apiError(404, "Item not found");
    }

    if (item.status === "SOLD") {
        throw new apiError(400, "You cannot request a sold item");
    }


    
    const requestExist=await prisma.request.findFirst({
        where:{
            itemId:itemId,
            userId:buyerId
        }
    })

    if(requestExist){
        throw new apiError(400,"you have already shown interest in this item ")
    }


    const request=await prisma.$transaction(async(prisma)=>{

        const newRequest=await prisma.request.create({
            data:{ 
             itemId:itemId,
             userId:buyerId,
            }
     
         })
     
        
         //once a buyer showes interest in an item a request is generated and status is changed from available to pending 
     
             await prisma.items.update({
             where:{id:itemId},
             data:{status:"PENDING"}
         })

         return newRequest
     

    })


  
  

    

    return res.status(200).json(new apiResponse(201,request,"request was created successfully"))

})

const fetchAllBuyerRequests= asyncHandler(async(req,res)=>{

    //we need to fetch requests for a particular seller and not all the requests
    //we have itemId and in item model there is the seller id
    //req.user we have the seller id

    const sellerId=req.user?.id //  seller id

    if(!sellerId){
        throw new apiError(500,"server issue while generating access token")
    }

    //extract sellers items ids


    const items=await prisma.items.findMany({

        where:{
            userId:sellerId,
            
        },
        select:{id:true}
        
    })

    

    const itemIds=items.map(item=>item.id)
    if (itemIds.length === 0) {
        return res.status(200).json(new apiResponse(200, [], "No buyer requests found"));
    }
    



    const requests=await prisma.request.findMany({
        where:{
            itemId:{
                in:itemIds
            }
        }
    })

    if(!requests){
        throw new apiError(400,"you dont have any requests currently")
    }

    


    return res.status(200).json(
        new apiResponse(200,requests,"fetched all buyers requests successfully")
    )





    // const requests=await prisma.request.findMany()

})

const deleteRequest=asyncHandler(async(req,res)=>{


    const{id}=req.body
    

    const request=await prisma.request.findUnique({
        where:{
            id:id
        }
    })
    if(!request){
        throw new apiError(400,"this request dosent exist")

    }

    const item =await prisma.items.findUnique({
        where:{
            id:request.itemId
        }
    })

    if(item.status==="SOLD"){
        throw new apiError(400,"you cannot delete a request for a sold item")
    }

    await prisma.request.delete({
        where:{id:id}
        
    })

    return res.status(200).json(
        new apiResponse(200,"","request was deleted successfully")
    )

})



export {
    createRequest,
    fetchAllBuyerRequests,
    deleteRequest
}
