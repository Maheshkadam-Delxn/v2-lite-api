import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/project"
import { verifyToken } from "@/lib/jwt";
import {z} from "zod"
import mongoose from "mongoose";

const projectUpdateSchema = z.object({
    name:z.string().min(1).optional(),
    code:z.string().min(1).optional(),
    type:z.enum(["Residential","Commercial","Industrial","Infrastructural"]).optional(),
    budget:z.number().min(0).optional(),
    startDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"Date must be in YYYY-MM-DD").optional(),
    endDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"Date must be in YYYY-MM-DD").optional(),
    currency: z.string().optional(),
  zoneOffset: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  projectPhoto: z.string().url("Invalid image URL").optional(),
  status: z.enum(["planned", "in-progress", "on-hold", "completed", "cancelled"]).optional(),
  members: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
}).partial();

export async function PATCH(req,{params}){
    try{
        const decoded = verifyToken(req);
        if(!decoded){
            return NextResponse.json(
                {success:false,error:"Unauthorized"},
                {status:401}
            );
        }

        await connectDB();

        const {id} = params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return NextResponse.json(
                {success:false,error:"Invalid project Id"},
                {status:400}
            );
        }

        const body = await req.json();
        const validatedData = projectUpdateSchema.parse(body);

        if (validatedData.startDate && validatedData.endDate) {
      if (new Date(validatedData.endDate) < new Date(validatedData.startDate)) {
        return NextResponse.json(
          { success: false, error: "End date cannot be before start date" },
          { status: 400 }
        );
      }
    }

    // ✅ Update project
    const updatedProject = await Project.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updatedProject }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
        {success:false,error:"Something went wrong"},
        {status:500}
    );
    }
}    