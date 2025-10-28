import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WOBillPayment from "@/models/workorder/billPayment";
import { verifyToken } from "@/lib/jwt";


export async function GET(req){
    const decoded = verifyToken(req);
    if(!req){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:404}
        );
    }

    try{
        await connectDB();

        const payment = await WOBillPayment.find()
        .populate("billNo","billNo netPayment")
        .populate("projectId","name code");

        if(!payment){
            return NextResponse.json(
                {success:false,message:"Payment not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:payment}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,message:error.message},
            {status:500}
        );
    }
}