import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Bill from '@/models/workorder/bill';
import WorkOrder from "@/models/workorder/workorder";
import AdvancePayment from "@/models/workorder/advancePayment";
import { verifyToken } from "@/lib/jwt";


export async function GET(req,{params}){

    const decoded = verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:404}
        );
    }

    try{

        const {id} = await params;
        console.log(id);

        
        
        await connectDB();

        const bill = await Bill.findById(id)
        .populate("projectId","name code")
        .populate("advancePayment","amount paymentStatus")
        .populate("workOrder","workorderNo");

    console.log(bill);
        if(!bill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:bill},
            {status:200}
        )
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        )
    }
}


export async function PUT(req,{params}){

    const decoded = verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:404}
        );
    }

    try{
        const {id} = await params;
        const body = await req.json();

        const existingBill = await Bill.findById(id);
        if(!existingBill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:404}
            );
        }

        let workOrderData = null;
        if(body.workOrder || existingBill.workOrder){
            const workOrderId = body.workOrder || existingBill.workOrder;
            workOrderData = await WorkOrder.findById(workOrderId).lean();
        }

        let advanceData = null;
        if(body.advancePayment || existingBill.advancePayment){
            const advId = body.advancePayment || existingBill.advancePayment;
            advanceData = await AdvancePayment.findById(advId).lean();
        }

        const deductionAmount = (body.items || []).reduce((sum,item)=> 
            sum + (item.amount || 0),
            0
        );

        const retention = Number(body.retentionAmount || 0);
        const taxPercent = Number(body.taxPercentage || 0);

        const workOrderTotal = Number(workOrderData?.totalAmount || 0);
        const advanceAmt = Number(advanceData?.amount || 0);

        const taxValue = (workOrderTotal*taxPercent)/100;
        const netPayment = workOrderTotal - deductionAmount - retention + taxValue + advanceAmt;

        const updateData = {
            ...body,
            deductionAmount,
            netPayment,
        };

        const updateBill = await Bill.findByIdAndUpdate(id,updateData,{
            new:true,
            runValidators:true 
        })
        .populate("projectId","name code")
        .populate("workOrder","workOrderNo totalAmount")
        .populate("advancePayment","amount paymentStatus");

        if(!updateBill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:401}
            );
        }

        return NextResponse.json(
            {success:true,data:updateBill,message:"Bill updated successfully"},
            {status:200}
        );
        
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}

export async function DELETE(req,{params}){
    try{
        const {id} = await params;

        await connectDB();

        const deleteBill = await Bill.findByIdAndDelete(id);

        if(!deleteBill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"Bill deleted successfully"},
            {status:200}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}