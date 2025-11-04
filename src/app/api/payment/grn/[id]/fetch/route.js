import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { GRN } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";

export async function GET(req,{params}){
    const decoded = await verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:401}
        );
    }

    try{
        await connectDB();

        const {id} = await params;

        const grn = await GRN.findById(id);

        if(!grn){
            return NextResponse.json(
                {success:false,message:"GRN is not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:grn,message:"GRN fetched successfully"},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}