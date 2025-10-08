import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { GRN } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";
import Project from "@/models/project";

export async function POST(req){
    const decoded = await verifyToken(req);
    if(!decoded){
        return NextResponse.json({success:false,error:"Unauthorized"},{status:401});
    }

    try{
        await connectDB();

        const body = await req.json();
        const {projectId,challanNo,date,...grnData} = body;

        const project = await Project.findById(projectId);

        if(!project){
            return NextResponse.json(
                {success:false,message:"Prject not found"},
                {status:404}
            );
        }

        if(!data || !challanNo){
            return NextResponse.json(
                {success:false,message:"Please provide all the fields"},
                {status:400}
            );
        }

        const inintails = project.name
        .split(" ")
        .map(word =>word[0])
        .join("")
        .toUpperCase();

        const code = project.code;

        const grnCount = await GRN.countDocuments({projectId});
        const serial = String(grnCount+1).padStart(5,"0");
        const grnNo = `${inintails}${code}-GRN-${serial}`;

        const grn = await GRN.create({
            ...grnData,
            grnNo,
            projectId
        });

        return NextResponse.json(
            {success:true,data:grn},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}