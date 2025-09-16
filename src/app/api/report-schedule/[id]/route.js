import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import ReportSchedule from "@/models/reportschedule";

// ✅ GET single schedule
export async function GET(req, { params }) {

    const {id} = await params;
  try {
    await connectDB();
    const schedule = await ReportSchedule.findById(id)
      .populate("project", "name code")
      .populate("sendTo", "name email");

    if (!schedule) {
      return NextResponse.json({ message: "Report Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE schedule
export async function PUT(req, { params }) {

    const {id} = await params;
  try {
    await connectDB();
    const body = await req.json();

    const updatedSchedule = await ReportSchedule.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSchedule) {
      return NextResponse.json({ message: "Report Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ✅ DELETE schedule
export async function DELETE(req, { params }) {
    const {id} = await params;
  try {
    await connectDB();
    const deletedSchedule = await ReportSchedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return NextResponse.json({ message: "Report Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Report Schedule deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
