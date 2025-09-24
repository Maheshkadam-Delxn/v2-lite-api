import { NextResponse } from "next/server";
<<<<<<< HEAD
import connectDB from "@/lib/mongoose";
import { Indent } from "@/models/payment/payment"; // since you export all in one file
=======
import connectDB from "../../../../lib/mongoose";
import { Indent } from "../../../../models/payment"; 
import Member from "../../../../models/member";
import Project from "../../../../models/project";
>>>>>>> da5a89cb8e5c4442ff24e10b4995b107c16f222b

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const indent = await Indent.create(body);
    return NextResponse.json({ success: true, data: indent }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();
  try {
    const url = new URL(req.url);
    const { status, projectId } = Object.fromEntries(url.searchParams);

    const query = {};
    if (status) query.status = status;
    if (projectId) query.projectId = projectId;

    const indents = await Indent.find(query).populate("assignTo projectId");
    return NextResponse.json({ success: true, data: indents });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
