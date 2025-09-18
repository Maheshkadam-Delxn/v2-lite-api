import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Bill from '@/models/workorder/bill'
import mongoose from "mongoose";


export async function GET(req,{params}){
    try{

        const {id} = await params;
        console.log(id);

        
        await connectDB();

        const bill = await Bill.findById(id)
        //.populate("projectId","name code")
        .lean()
        //.populate("workOrder","workorderNo");

    console.log(bill);
        if(!bill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:bill},
            {status:200}
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
        const {id} = await params;
        const body = await req.json();

        const updateBill = await Bill.findByIdAndUpdate(id,body,{
            new:true,
            runValidators:true 
        });

        if(!updateBill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:401}
            );
        }

        return NextResponse.json(
            {success:true,data:updateBill}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}

export async function DELETE(req,{params}){
    try{
        const {id} = await params;

        await connectDB();

        const deleteBill = await Bill.findByIdAndDelete(params);

        if(!deleteBill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"Bill deleted successfully"},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}