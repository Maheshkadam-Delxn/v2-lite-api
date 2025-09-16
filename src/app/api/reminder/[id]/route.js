import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Reminder from "@/models/reminder";

// ✅ GET reminder by ID
export async function GET(req, { params }) {

    const {id} = await params;
  try {
    await connectDB();
    const reminder = await Reminder.findById(id)
      

    if (!reminder) {
      return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json(reminder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE reminder
export async function PUT(req, { params }) {

    const {id} = await params;
  try {
    await connectDB();
    const body = await req.json();

    const updatedReminder = await Reminder.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReminder) {
      return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json(updatedReminder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ✅ DELETE reminder
export async function DELETE(req, { params }) {

    const {id} = await params;
  try {
    await connectDB();
    const deletedReminder = await Reminder.findByIdAndDelete(id);

    if (!deletedReminder) {
      return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
