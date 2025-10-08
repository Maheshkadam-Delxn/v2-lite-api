import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { GRN } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(req,{params}){
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

        const deleteGRN = await GRN.findByIdAndDelete(id);

        if(!deleteGRN){
            return NextResponse.json(
                {success:false,message:"COuld not delete GRN"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"GRN deleted successfully"},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}