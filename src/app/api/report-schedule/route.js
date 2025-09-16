import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import ReportSchedule from "@/models/reportschedule";

// ✅ GET all schedules
export async function GET() {
  try {
    await connectDB();
    const schedules = await ReportSchedule.find()
      .populate("project", "name code")
      .populate("sendTo", "name email");

    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ CREATE schedule
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    

    const schedule = new ReportSchedule(body);
    const savedSchedule = await schedule.save();

    return NextResponse.json(savedSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
