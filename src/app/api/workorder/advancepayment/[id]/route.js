import { NextResponse } from "next/server";
import AdvancePayment from "@/models/workorder/advancePayment"
import connectDB from "@/lib/mongoose";
import { verifyToken } from "@/lib/jwt";
import WorkOrder from "@/models/workorder/workorder";

export async function GET(req,{params}){
    try{

        const decoded = verifyToken(req);
                  if(!decoded){
                    return NextResponse.json(
                      {success:false,error:"Unauhorized"},
                      {status:401}
                    );
                  }

        const {id} = await params;

        await connectDB();

        const body = await AdvancePayment.findById(id);

        if(!body){
            return NextResponse.json(
                {success:false,message:"Payment is not present"},
                {status:404}
            )
        }

        return NextResponse.json(
            {success:true,data:body} 
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}

export async function PUT(req,{params}){
    try{

        const decoded = verifyToken(req);
                  if(!decoded){
                    return NextResponse.json(
                      {success:false,error:"Unauhorized"},
                      {status:401}
                    );
                  }
        const {id} = await params;
        await connectDB();

        const body = await req.json();

        const exisitingPayment = await AdvancePayment.findById(id);

        if(!exisitingPayment){
            return NextResponse.json(
                {success:false,message:"Payment not found"},
                {status:404}
            );
        }

        if(exisitingPayment.paymentStatus !== "pending"){
            return NextResponse.json(
                {success:false,message:"Cannot edit the payment"},
                {status:403}
            );
        }

        if(body.workOrder){
            const workOrder = await WorkOrder.findById(body.workOrder);
            if(!workOrder){
                return NextResponse.json(
                    {success:false,message:"Invalid work order selected"},
                    {status:404}
                );
            }

            body.paymentStatus = "linked",
            body.approvedBy = decoded.id;
            body.approvedAt = new Date();

            workOrder.advancePayment = id;
            await workOrder.save();
        }
        const updatePayment = await AdvancePayment.findByIdAndUpdate(id,body,{
            new:true,
            runValidators:true,
        });



        if(!updatePayment){
            return NextResponse.json(
                {success:false,message:"Cannot update the payment"},
                {status:403}
            )
        }

        return NextResponse.json(
            {success:true,message:"payment is updated"},
            {status:201}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}