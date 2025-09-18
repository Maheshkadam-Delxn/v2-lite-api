import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Bill from '@/models/workorder/bill'
import Project from "@/models/project";

function getInitials(name){
    return name 
    .split(" ")
    .map(word => word[0].toUpperCase())
    .join("")
    .slice(0,2);
}

export async function POST(req){
    try{
        await connectDB();

        const body = await req.json();
        const {projectId,...billData} = body;

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

        const inintails = getInitials(project.name);
        const code = project.code;

        const billCount = await Bill.countDocuments({projectId});

        const serial = String(billCount+1).padStart(5,"0");
        const billNo = `${inintails}${code}-BILL-${serial}`;

        const bill = await Bill.create({
            ...billData,
            billNo,
            projectId
        });

        return NextResponse.json(
            {success:true,data:bill},
            {status:201}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}

export async function GET(req){
     try{
        await connectDB();

        const {searchParams} = new URL(req.url);
        const projectId = searchParams.get("projectId");

        const filter = projectId ? {projectId} : {};

        const bills = await Bill.find(filter)
        .populate("projectId","name code")
        .populate("workOrder","workOrderNo");

        return NextResponse.json(
            {success:true, data:bills}
        );
     }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
     }
}