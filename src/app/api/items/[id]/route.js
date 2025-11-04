import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Item from "@/models/item";

// ✅ GET SINGLE ITEM
export async function GET(request, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const item = await Item.findById(id);
    if (!item)
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("GET /api/items/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATE ITEM
export async function PUT(request, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await Item.findByIdAndUpdate(id, body, { new: true });
    if (!updated)
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Item updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/items/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE ITEM
export async function DELETE(request, { params }) {
  await connectDB();
  try {
    const { id } = params;

    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/items/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
