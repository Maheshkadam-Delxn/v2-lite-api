import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WOBillPayment from "@/models/workorder/billPayment";
import Project from "@/models/project";
import { verifyToken } from "@/lib/jwt";
import { BillPayment } from "@/models/payment";
import Bill from "@/models/workorder/bill";

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

        const {billNo,paymentMode,transactionNo,paidAmount,paymentDate,remark,projectId} = await req.json();

        if(!billNo || !projectId || !paymentMode || !transactionNo || !paidAmount){
            return NextResponse.json(
                {success:false,message:"Fields are required"},
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

        const bill = await Bill.findById(billNo);
        if(!bill){
            return NextResponse.json(
                {success:false,message:"Bill not found"},
                {status:404}
            );
        }

        const payment = await WOBillPayment.create({
            billNo,
            projectId,
            paymentMode,
            transactionNo,
            paidAmount,
            paymentDate:paymentDate ? new Date(paymentDate) : new Date(),
            remark,
        });


        return NextResponse.json(
            {success:true,message:"Payment recorder successfully",data:payment},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}