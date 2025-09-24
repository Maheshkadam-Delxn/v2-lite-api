import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import RFI from "@/models/approvals/rfi"
import Project from "@/models/project"

async function generateReferenceNo(project){
    const initials = project.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

    const code = project.code;

    const count = await RFI.countDocuments({projectId:project._id});
    const number = String(count+1).padStart(5,"0");

    return `${initials}${code}-RFI-${number}`;
}


export async function GET(req){
    try{
        await connectDB();
        const {searchParams} = new URL(req.url);
        console.log("search",searchParams);
        const projectId = searchParams.get("projectId");

        console.log("projectid",projectId);

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"Project ID is required"},
                {status:400}
            );
        }

        const rfis = await RFI.find({projectId})
        //.populate("projectId","name code","toUser","name email")
        //.populate("toUser","name")
        .sort({createdAt:-1});

        console.log("RFI",rfis);
        

        if(!rfis){
            return NextResponse.json(
                {success:false,message:"Could not find the RFI"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:rfis},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to fetch RFI"},
            {status:500}
        )
    }
}

export async function POST(req){
    try{
        await connectDB();
        const body = await req.json();
        const projectId = body.projectId;

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"Project Id is required"},
                {status:400}
            );
        }

        const project = await Project.findById(projectId);

        if(!project){
            return NextResponse.json(
                {success:false,message:"Project not found"},
                {status:404}
            );
        }

        const referenceNo = await generateReferenceNo(project);

        const newRFI = await RFI.create({
            ...body,
            projectId,
            referenceNo, 
        });

        return NextResponse.json(
            {success:true,message:"RFI created successfully",data:newRFI},
            {status:201}
        );
    }catch(error){
        console.log(error);
        return NextResponse.json(
            {success:false,message:"Failed to create RFI"},
            {status:500}
        );
    }
}