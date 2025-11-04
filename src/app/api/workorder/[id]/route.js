import { NextResponse } from "next/server";
import WorkOrder from '@/models/workorder/workorder'
import connectDB from "@/lib/mongoose";
import { verifyToken } from "@/lib/jwt";

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

        const body = await WorkOrder.findById(id);

        if(!body){
            return NextResponse.json(
                {success:false,message:"Workorder not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"Found workorder successfully",data:body},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
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

        const formData = await req.json();
        const body =  await WorkOrder.findByIdAndUpdate(id,formData,{
            new:true,
            runValidators:true
        });

        if(!body){
            return NextResponse.json(
                {success:false,message:"WorkOrder not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:body},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}


