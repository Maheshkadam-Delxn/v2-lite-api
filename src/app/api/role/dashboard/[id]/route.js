import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Dashboard from "@/models/dashboard";

export async function PUT(req,{params}){
    await connectDB();

    try{

        const {id} = await params;
        const body = await req.json();

        const updatedPermission = await Dashboard.findByIdAndUpdate(id,body,{
            new:true,
            runValidators:true,
        });

        if(!updatedPermission){
            return NextResponse.json(
                {success:false,error:"Dashboard permission not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"Dashboard permission updated",data:updatedPermission},
            {status:200}
        );
    }catch(error){
        console.log("Dashboard API error",error);
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        );
    }
}

export async function DELETE(req,{params}){
    await connectDB();

    try{
        const {id} = params;

        const deletePermission = await Dashboard.findByIdAndDelete(id);

        if(!deletePermission){
            return NextResponse.json(
                {success:false,error:"Dashboard permission not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"Dashboard permission delete"},
            {status:200}
        );
    }catch(error){
        console.log("Dashbaord API delete error",error);
        return NextResponse.json(
            {success:false,error:"Dashboard API error",error},
            {status:500}
        )
    }
}