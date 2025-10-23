import { NextResponse } from "next/server";
import ModuleDemo from "@/models/module";

export  async function POST(req){
    try{
        const body = await req.json();

        const moduledemo = await ModuleDemo.create(body);

        return NextResponse.json(
            {success:true,message:"Module created"},
            {status:201}
        );
    }catch(error){
        return NextResponse.json(
            {success:false,error:error.message},
            {status:500}
        );
    }
}