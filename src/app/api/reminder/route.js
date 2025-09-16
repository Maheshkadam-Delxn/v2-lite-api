import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Reminder from "@/models/reminder";

// ✅ GET all reminders
export async function GET() {
  try {
    await connectDB();
    const reminders = await Reminder.find()
      
    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ CREATE reminder
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const reminder = new Reminder(body);
    const savedReminder = await reminder.save();

    return NextResponse.json(savedReminder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
