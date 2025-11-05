import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { GRN } from "@/models/payment";
import "@/models/project";

// ✅ Create GRN
<<<<<<< HEAD
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // ✅ Find last GRN to generate next grnId
    const lastGRN = await GRN.findOne().sort({ createdAt: -1 }).lean();

    let nextNumber = 1;
    if (lastGRN && lastGRN.grnId) {
      const lastNumber = parseInt(lastGRN.grnId.replace(/\D/g, ""), 10);
      nextNumber = lastNumber + 1;
    }

    // ✅ Generate new GRN ID
    const nextGrnId = `GRN-${nextNumber.toString().padStart(3, "0")}`;

    // ✅ Create GRN with auto-generated ID
    const grn = await GRN.create({
      ...body,
      grnId: nextGrnId,
    });
=======
// export async function POST(req) {
//   await connectDB();
//   try {
//     const body = await req.json();
//     const grn = await GRN.create(body);
>>>>>>> 020cad8a92dffc40b0d67e4723aa9e769b95c77d

//     return NextResponse.json({
//       success: true,
//       message: "GRN created successfully",
//       data: grn,
//     });
//   } catch (error) {
//     console.error("POST /api/payment/grn error:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


// ✅ Get all GRNs
export async function GET() {
  await connectDB();
  try {
    const grns = await GRN.find().populate("projectId");
    return NextResponse.json({ success: true, data: grns });
  } catch (error) {
    console.error("GET /api/payment/grn error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
