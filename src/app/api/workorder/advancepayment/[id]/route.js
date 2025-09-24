import { NextResponse } from "next/server";
import AdvancePayment from "@/models/workorder/advancePayment"
import connectDB from "@/lib/mongoose";

export async function GET(req,{params}){
    try{
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

export async function PUT(req,{parmas}){
    try{
        const {id} = await params;
        await connectDB();

        const body = await req.json();
        const updatePayment = await AdvancePayment.findByIdAndUpdate(id,body,{
            new:true,
            runValidators:true
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