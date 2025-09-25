import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import RFI from "@/models/approvals/rfi";

export async function PUT(req,{params}){
    try{
        await connectDB();
        const {id} = await params;
        console.log("ID",id);
        const body = await req.json();
       // const projectId = body.projectId;

        // if(!projectId){
        //     return NextResponse.json(
        //         {success:false,message:"Project ID is required"},
        //         {status:400}
        //     );
        // }

        const updateRFI = await RFI.findOneAndUpdate(
            {referenceNo:id},
            body,
            {new:true}
        );

        if(!updateRFI){
            return NextResponse.json(
                {success:false,message:"RFI not found for this project"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"RFI updated",data:updateRFI},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to update"},
            {status:500}
        );
    }
}


export async function DELETE(req,{params}){
    try{
        await connectDB();
        const{id} = await params;
        const {searchParams} = new URL(req.url);
        const projectId = searchParams.get("projectId");

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"Project ID is required"},
                {status:400}
            );
        }

        const deleted = await RFI.findByIdAndDelete({_id:id,projectId});

        if(!deleted){
            return NextResponse.json(
                {success:false, message:"RFI not found for this project"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"RFI deleted successfully"},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to delete"},
            {status:500}
        );
    }
}