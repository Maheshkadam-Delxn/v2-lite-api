import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Expense } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(req,{params}){
    const decoded = await verifyToken(req);
    if(!decoded){
        return NextResponse.json(
            {success:false,error:"Unauthorized"},
            {status:401}
        );
    }

    try{
        await connectDB();

        const {id} = await params;
        const body = await req.json();

        if(!id){
            return NextResponse.json(
                {success:false,error:"Expense id is required"},
                {status:400}
            );
        }

        if(Object.keys(body).length === 0){
            return NextResponse.json(
                {success:false,error:"No data provided for update"},
                {status:400}
            );
        }

        const updatedExpense = await Expense.findByIdAndUpdate(id,body,{new:true,runValidators:true})
        .populate("vendor","name")
        .populate("projectId","name");

        if(!updatedExpense){
            return NextResponse.json(
                {success:false,error:"Expense not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,data:updatedExpense,message:"Expense updated successfully"},
            {status:200}
        );
    }catch(error){
        console.error("Failed to update expense",error);
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        );
    }
}