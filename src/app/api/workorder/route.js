import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkOrder from '@/models/workorder/workorder'
import Project from '@/models/project'
import { verifyToken } from "@/lib/jwt";
import BOQ from "@/models/project-resources/boq";
import Vendor from "@/models/vendor";
import AdvancePayment from "@/models/workorder/advancePayment"

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

        const body = await WorkOrder.find().populate("vendor","name"); 

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
        const {projectId,vendor,items=[],retentionPercentage=0,taxPercentage=0,advancePayment} = body;

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

        const vendorData = await Vendor.findById(vendor);
        if(!vendorData){
            return NextResponse.json(
                {success:false,message:"Vendor not found"},
                {status:404}
            );
        }


        const projectCode = projectData.code;

        const lastWorkOrder = await WorkOrder.findOne({projectId}).sort({createdAt:-1}).lean();
        let sequence = 1;
        if(lastWorkOrder?.workOrderNo){
            const lastSeq = parseInt(lastWorkOrder.workOrderNo.split("-").pop(),10);
            sequence = lastSeq+1;
        }

        const formattedSeq = String(sequence).padStart(5,"0");
        const workOrderNo = `${projectCode}-WO-${formattedSeq}`;

        let totalAmount = 0;

        const processItems = items.map((item) =>{
            const total = (item.rate || 0) * (item.quantity || 0);
            totalAmount += total;
            return {...item,total};
        })

        const retentionAmount = (retentionPercentage/100) * totalAmount;
        const taxAmount = (taxPercentage/100) * totalAmount;

        let advanceUsed = 0;
        if(advancePayment){
            const advance = await AdvancePayment.findById(advancePayment);
            if(advance){
                advanceUsed = advance.amount || 0;
                await AdvancePayment.findByIdAndUpdate(advancePayment,{
                    workOrder:newWork?._id,
                    paymentStatus:"linked",
                });
            }
        }

        const netPayable = totalAmount - retentionAmount - advanceUsed + taxAmount;

        const newWork = await WorkOrder.create({
            ...body,
            items:processItems,
            workOrderNo,
            totalAmount,
            retentionAmount,
            taxAmount,
            advanceUsed,
            netPayable 
        });

        if(!newWork){
            return NextResponse.json(
                {success:false,message:"Work order not created"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"Work order created successfully",data:newWork}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}