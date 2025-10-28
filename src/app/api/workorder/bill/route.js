import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Bill from '@/models/workorder/bill'
import Project from "@/models/project";
import { verifyToken } from "@/lib/jwt";
import WorkOrder from "@/models/workorder/workorder"
import AdvancePayment from "@/models/workorder/advancePayment";

export async function POST(req){

    const decoded = verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:404}
        );
    }
    try{
        await connectDB();

        const body = await req.json();
        const {projectId,workOrder,advancePayment,items=[],remark} = body;

        if(!projectId || !workOrder){
            return NextResponse.json(
                {success:false,message:"Project Id and workorder is required"},
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

        const workorder = await WorkOrder.findById(workOrder);
        if(!workorder){
            return NextResponse.json(
                {success:false,message:"Work order not found"},
                {status:404}
            );
        }

        
        const code = project.code;

        const billCount = await Bill.countDocuments({projectId});

        const serial = String(billCount+1).padStart(5,"0");
        const billNo = `${code}-BILL-${serial}`;

        const grossAmount = workorder.totalAmount || 0;
        const retentionAmount = (grossAmount*(workorder.retentionPercentage || 0))/100;
        const taxAmount = (grossAmount *(workorder.taxPercentage || 0))/100;

        const deductionAmount  = items.reduce((sum,d)=>sum+(Number(d.amount) || 0),0);

        let advanceUsed = 0;
        if(advancePayment){
            const advance = await AdvancePayment.findById(advancePayment);
            if(advance){
                advanceUsed = advance.amount || 0;
                const newStatus = advanceUsed >= grossAmount ? "fully recovered" : "partailly";
                await AdvancePayment.findByIdAndUpdate(advancePayment,{
                    paymentStatus:newStatus,
                })
            }
        }

        const netPayment = grossAmount - retentionAmount - deductionAmount - advanceUsed + taxAmount;


        const bill = await Bill.create({
           
            billNo,
            projectId,
            workOrder:workorder,
            advancePayment:advancePayment || null,
            taxPercentage:workorder.taxPercentage,
            retentionAmount:retentionAmount,
            deductionAmount,
            netPayment,
            items,
            remark 
        });

        return NextResponse.json(
            {success:true,data:bill,message:"Bill created successfully"},
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
    const decoded = verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:404}
        );
    }

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