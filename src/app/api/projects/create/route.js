import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { verifyToken } from "@/lib/jwt";
import {z} from "zod";
import Project from "@/models/project";

const projectSchema = z.object({
    name:z.string().min(1,"Project name is required"),
    code:z.string().min(1,"Code is required"),
    type:z.enum(["Residential","Commercial","Industrial","Infrastructual"],{
        required_error:"Project type is required"
    }),
    budget:z.string().min(0,"Budget must be greater than or equal to 0"),
    startDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"Date must be in form of YYYY-MM-DD"),
    endDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"Date must be in form of YYYY-MM-DD"),
    currency:z.string().default("INR"),
    zoneOffSet:z.string().default("+00:00"),
    location:z.string().optional(),
    description:z.string().optional(),
    projectPhoto:z.string().url("Invalid URL").optional().or(z.literal("").optional()),
    status:z.enum(["planned","in-progress","on-hold","completed","cancelled"]).optional(),
    members:z.array(z.string()).default([]),
    tags:z.array(z.string()).optional().default([]),
});

export async function POST(req){
    let decoded = verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:401}
        );
    }
    try{

        await connectDB();

        const body = await req.json();
        const validateData = projectSchema.parse(body);

        if(validateData.endDate && validateData.startDate){
            if(new Date(validateData.endDate)<new Date(validateData.startDate)){
                return NextResponse.json(
                    {success:false,error:"End date cannot be before start date"},
                    {status:400}
                );
            }
        }

        const project = await Project.create(validateData);
        
        return NextResponse.json(
            {success:true,project},
            {status:201}
        );
        
    }catch(error){
        console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
    }
}