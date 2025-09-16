import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Event from "@/models/event";

// GET single event
export async function GET(req, { params }) {

    const {id} = await params;
  try {
    await connectDB();
    const event = await Event.findById(id)
    //   .populate("project", "name")
    //   .populate("specific", "name email")
    //   .populate("sentTo", "name")
    //   .populate("triggeredBy", "name email");

    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// UPDATE event
export async function PUT(req, { params }) {
    
  try {
    await connectDB();
    const {id} = await params;
    const body = await req.json();
    const updatedEvent = await Event.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEvent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE event
export async function DELETE(req, { params }) {

    const {id} = await params;
  try {
    await connectDB();
    const deletedEvent = await Event.findByIdAndDelete(params.id);

    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
