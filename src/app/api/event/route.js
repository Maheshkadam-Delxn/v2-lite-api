import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Event from '@/models/event'

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("body",body);
    const newEvent = await Event.create(body);
    console.log("event",newEvent);
    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


export async function GET() {
  try {
    await connectDB();
    const events = await Event.find();
      

      console.log("Event",events);
    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}