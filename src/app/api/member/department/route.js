import connectDB from "@/lib/mongoose";
import department from "@/models/department";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

function checkAuth(req){
    const authHeader = req.headers.get("authorization");
    if(!authHeader?.startWith("Bearer ")){
        return {
            error:NextResponse.json(
                {success:false,message:"Unauthorized: no token"},
                {status:401}
            )
        };
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if(!decoded){
        return {
            error:NextResponse.json(
                {success:false,message:"Unauthorized:Invalid token"},
                {status:401}
            )
        }
    }

        if(!["admin","superadmin"].includes(decoded.role)){
            return {
                error:NextResponse.json(
                    {success:false,message:"Forbidden:Insufficient permission"},
                    {status:403}
                )
            };
        }


        return {user:decoded};
    }


export async function POST(req){

    const auth = checkAuth(req);
    if(auth.error) return auth.error;
    try{
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