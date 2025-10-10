import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import {Indent} from "@/models/payment"
import { verifyToken } from "@/lib/jwt";
import Project from "@/models/project";

export async function POST(req){
    const decoded = await verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:404}
        );
    }

    try{
        await connectDB();

        const body = await req.json();
        const {projectId,...rest} = body;

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"Project ID is needed"},
                {status:400}
            );
        }

        const project = await Project.findById(projectId);

        if(!project){
            return NextResponse.json(
                {success:false,error:"Invalid project Id"},
                {status:404}
            );
        }

        const initials = project.name
        .split(" ")
        .map((word)=>word[0])
        .join("")
        .toUpperCase();

        const code = project.code;

        const indentCount = await Indent.countDocuments({projectId});
        const serial = String(indentCount+1).padStart(5,"0");
        const indentNo = `${initials}${code}-INDENT-${serial}`;

        const indent = await Indent.create({
            ...rest,
            indentNo,
            projectId
        });

        return NextResponse.json(
            {success:true,data:indent},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        );
    }
}