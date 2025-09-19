import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import SnagReport from "@/models/approvals/snag-report"
import Project from "@/models/project"


export async function GET(){
    try{
        await connectDB();

        const body = await SnagReport.find();

        if(!body){
            return NextResponse.json(
                {success:false,message:"Report not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:body},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}

export async function POST(req){
    try{
        await connectDB();

        const formData = await req.json();
        const {projectId} = formData;

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"Project id is required"},
                {status:400}
            );
        }

        const projectData = await Project.findById(projectId);

        if(!projectData){
            return NextResponse.json(
                {success:false,message:"Project not found"},
                {status:404}
            );
        }

        const inintails = projectData.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();

        const projectCode = projectData.code;
        const lastReport = await SnagReport.findOne({projectId}).sort({createdAt:-1});
        let sequence = 1;
        if(lastReport?.snagId){
            const lastseq = parseInt(lastReport.snagId.split("-").pop(),10);
            sequence = lastseq+1;
        }

        const formattedSeq = String(sequence).padStart(5,'0');
        const snagId = `${inintails}${projectCode}-SNAG-${formattedSeq}`;
        const newReport = await SnagReport.create({
            ...formData,
            snagId
        });

        if(!newReport){
            return NextResponse.json(
                {success:false,message:"Report not created"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"New Report created"},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}