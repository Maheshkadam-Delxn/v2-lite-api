import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import ModuleDemo from "@/models/module";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    let createdModules;

    if (Array.isArray(body)) {
      // Bulk creation
      createdModules = await ModuleDemo.insertMany(body, { ordered: false });
    } else {
      // Single creation
      createdModules = await ModuleDemo.create(body);
    }

    return NextResponse.json(
      {
        success: true,
        message: Array.isArray(body)
          ? "Modules created successfully"
          : "Module created successfully",
        data: createdModules
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Module POST error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Duplicate module name detected" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const modules = await ModuleDemo.find().sort({ name: 1 }); // sorted alphabetically

    return NextResponse.json(
      { success: true, count: modules.length, data: modules },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ ModuleDemo GET (all) error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}