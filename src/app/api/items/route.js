import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Item from "@/models/item";

// ✅ CREATE ITEM
export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();

    // ✅ Find last inserted item to generate next itemCode
    const lastItem = await Item.findOne().sort({ createdAt: -1 }).lean();

    let nextNumber = 1;
    if (lastItem && lastItem.itemCode) {
      // Extract numeric part, e.g., ITM005 → 5
      const lastNumber = parseInt(lastItem.itemCode.replace(/\D/g, ""), 10);
      nextNumber = lastNumber + 1;
    }

    // ✅ Generate next code with leading zeros (3 digits)
    const nextItemCode = `ITM${nextNumber.toString().padStart(3, "0")}`;

    // ✅ Attach auto-generated code
    const itemData = { ...body, itemCode: nextItemCode };

    const item = await Item.create(itemData);

    return NextResponse.json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    console.error("POST /api/item error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ GET ALL ITEMS (optional filters)
export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const filter = {};
    if (category) filter.category = category;
    if (search)
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { itemCode: { $regex: search, $options: "i" } },
      ];

    const items = await Item.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
