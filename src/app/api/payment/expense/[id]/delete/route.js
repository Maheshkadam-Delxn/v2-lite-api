import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Expense } from "@/models/payment";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(req,{params}){
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

        if(!id){
            return NextResponse.json(
                {success:false,error:"Expense ID is required"},
                {status:400}
            );
        }

        const deleteExpense = await Expense.findByIdAndDelete(id);

        if(!deleteExpense){
            return NextResponse.json(
                {success:false,error:"Expense not found"},
                {status:404}
            );
        }

        return NextResponse.json(
            {success:true,message:"Expense deleted successfully"},
            {status:200}
        );
    }catch(error){
        console.error("Failed to delete expense",error);
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        );
    }
}