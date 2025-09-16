import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/project"

export async function POST(req){
    try{
        await connectDB();

        const data = await req.json();

        const newProject = new Project(data);
        await newProject.save();

        return NextResponse.json(
            {success:true,message:"Project created successfully",data:newProject},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to create Project",error:error.message},
            {status:404}
        );
    }
};