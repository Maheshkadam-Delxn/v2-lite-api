import connectDB from "@/lib/mongoose";
import department from "@/models/department";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        connectDB();
        const body = await req.json();

        const newDepartment = new department(body);
        await newDepartment.save();

        return NextResponse.json(
            {success:true,message:"Department created successfully",data:newDepartment},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to create department",error:error.message},
            {status:404}
        );
    }
};