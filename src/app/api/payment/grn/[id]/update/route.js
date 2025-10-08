import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { GRN } from "@/models/payment";
import Project from "@/models/project";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req,{params}){
    const decoded = await verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:401}
        );
    }

    try{
        await connectDB();

        const {id} = params;
        const body = await req.json();

        const updateGRN = await GRN.findByIdAndUpdate(
            id,
            body,
            {new:true}
        );

        if(!updateGRN){
            return NextResponse.json(
                {success:false,message:"GRN not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:updateGRN,message:"GRN updated successfully"},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500},
        );
    }
}