import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import AdvancePayment from "@/models/workorder/advancePayment"
import Project from "@/models/project"
import { verifyToken } from "@/lib/jwt";


export async function GET(){
    try{
        await connectDB();

        const body = await AdvancePayment.find();

        if(!body){
            return NextResponse.json(
                {success:false,message:"Payment not fouund"},
                {status:404}
            )
        }

        return NextResponse.json(
            {success:true,data:body},
            {status:201}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}


export async function POST(req){
    try{
        await connectDB();

        const body = await req.json();
        const {projectId} = body;

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"Project Id required"},
                {status:400}
            )
        }

        const projectData = await Project.findById(projectId);

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"project not found"},
                {status:404}
            )
        }

        const initails = projectData.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();

        const projectCode = projectData.code;

        const lastPayment = await AdvancePayment.findOne({projectId}).sort({createdAt:-1}).lean();
        let sequence = 1;
        if(lastPayment?.paymentNo){
            const lastSeq = parseInt(lastPayment.paymentNo.split("-").pop(),10);
            sequence = lastSeq+1;
        }

        const formattedSeq  = String(sequence).padStart(5,"0");
        const paymentNo = `${initails}${projectCode}-APN-${formattedSeq}`;
        const newPayment = await AdvancePayment.create({
            ...body,
            paymentNo
        });

        if(!newPayment){
            return NextResponse.json(
                {success:false,message:"Work order not created"},
                {status:404}
            )
        }

        return NextResponse.json(
            {success:true,message:"Work order created successfully"}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}
