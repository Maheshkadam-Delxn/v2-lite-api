import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Drawing from '@/models/project-resources/drawing'

export async function GET(req,{params}){
    try{
        await connectDB();

        const {id} = await params;

        const drawings = await Drawing.findById(id).populate(
            "projectId",
            "name code"
        );

        if(!drawings){
            return NextResponse.json(
                {success:false,message:"Drawing not found"},
                {status:404}
            )
        }
        return NextResponse.json(
            {success:true,message:"Drawing found successfully"},
            {status:201}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}


export async function PUT(req,{params}) {
    try{
        await connectDB();
        const {id} = await params;
        const body = await req.json();

        const updateDrawing = await Drawing.findByIdAndUpdate(id,body,{
            new:true,
            runValidator:true 
        });

        if(!updateDrawing){
            return NextResponse.json(
                {success:false,message:"Drawing not found"},
                {status:404}
            )
        }

        return NextResponse.json(
            {success:true,message:"Drawing updated",data:updateDrawing},
            {status:201}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}

export async function DELETE(req,{params}){
    try{
        await connectDB();

        const {id} = await params;
        const deleteDrawing = await Drawing.findByIdAndDelete(id);

        if(!deleteDrawing){
            return NextResponse.json(
                {success:false,message:"Drawing not found"},
                {status:404}
            )
        }

        return NextResponse.json(
            {success:true,message:"Drawing delete"},
            {status:200}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}