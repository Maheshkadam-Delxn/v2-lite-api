import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkOrder from '@/models/workorder/workorder'
import Project from '@/models/project'
import { verifyToken } from "@/lib/jwt";

export async function GET(req){
    try{

        const decoded = verifyToken(req);
          if(!decoded){
            return NextResponse.json(
              {success:false,error:"Unauhorized"},
              {status:401}
            );
          }

        await connectDB();

        const body = await WorkOrder.find();

        if(!body){
            return NextResponse.json(
                {success:false,message:"Work order not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:body},
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
};

export async function POST(req){
    try{

        const decoded = verifyToken(req);
          if(!decoded){
            return NextResponse.json(
              {success:false,error:"Unauhorized"},
              {status:401}
            );
          }

        await connectDB();

        const body = await req.json();
        const {projectId} = body;

        console.log("project",projectId);

        if(!projectId){
            return NextResponse.json(
                {success:false,message:"Project Id is required"},
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

        const initials = projectData.name
        .split(" ")
        .map(word =>word[0])
        .join("")
        .toUpperCase();

        const projectCode = projectData.code;

        const lastWorkOrder = await WorkOrder.findOne({projectId}).sort({createdAt:-1}).lean();
        let sequence = 1;
        if(lastWorkOrder?.workOrderNo){
            const lastSeq = parseInt(lastWorkOrder.workOrderNo.split("-").pop(),10);
            sequence = lastSeq+1;
        }

        const formattedSeq = String(sequence).padStart(5,"0");
        const workOrderNo = `${initials}${projectCode}-WO-${formattedSeq}`;
        const newWork = await WorkOrder.create({
            ...body,
            workOrderNo
        });

        if(!newWork){
            return NextResponse.json(
                {success:false,message:"Work order not created"},
                {status:404}
            );
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