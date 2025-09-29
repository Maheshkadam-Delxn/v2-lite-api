import connectDB from "@/lib/mongoose";
import department from "@/models/department";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";



export async function POST(req){

    // const auth = checkAuth(req);
    // if(auth.error) return auth.error;
    try{

        const decoded = verifyToken(req);
          if(!decoded){
            return NextResponse.json(
              {success:false,error:"Unauhorized"},
              {status:401}
            );
          }
        connectDB();
        const body = await req.json();

        if(!body.name ){
            return NextResponse.json(
                {success:false,message:"Department name is required"},
                {status:400}
            )
        }

        const newDepartment = new department(body);
        await newDepartment.save();

        return NextResponse.json(
            {success:true,message:"Department created successfully",data:newDepartment},
            {status:200}
        );
    }catch(error){
        if(error === 11000){
        return NextResponse.json(
            {success:false,message:"Failed to create department",error:error.message},
            {status:500}
        );
    }
    }
};