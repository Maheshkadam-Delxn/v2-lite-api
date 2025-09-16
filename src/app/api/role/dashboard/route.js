import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Dashboard from "@/models/dashboard";

export async function POST(req){
    await connectDB();

    try{
        const body = await req.json();
        const {project,role,viewType,module,sequenceNo} = body;

        if(!project || !role || !viewType || !module || !sequenceNo ){
            return NextResponse.json(
                {success:false,error:"All fields are required"},
                {status:400}
            )
        }

        const dashboardPermission = new Dashboard(body);
        await dashboardPermission.save();

        return NextResponse.json(
            {success:true,message:"Dashboard permission added",data:dashboardPermission},
            {status:201}
        );
    }catch(error){
        console.log("Dashboard API POST error",error);

        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        );
    }
}