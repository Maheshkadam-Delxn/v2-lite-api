//   /app/api/auth/register

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export async function POST(req) {
  await connectDB();
  console.log("✅ DB connection confirmed inside register API (POST)");

  try {
    const { name, email, phone_number, password, role, memberRole } =
      await req.json();

    // Validation 
    if (!name || !email || !phone_number || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
        },
        { status: 400 }
      );
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    const existingPhone = await User.findOne({ phone_number });
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: "Phone number already registered" },
        { status: 400 }
      );
    }

    // Superadmin Bootstrap 
    const userCount = await User.countDocuments();
    let finalRole = role || "member";

    if (userCount === 0) {
      // first user becomes superadmin
      finalRole = "superadmin";
    } else if (role === "superadmin") {
      // prevent creating another superadmin
      const superAdminExists = await User.findOne({ role: "superadmin" });
      if (superAdminExists) {
        return NextResponse.json(
          { success: false, error: "Superadmin already exists" },
          { status: 400 }
        );
      }
    }

    // Hash Password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User 
    const user = await User.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      role: finalRole,
      memberRole: finalRole === "member" ? memberRole : null,
    });

    // hide password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { success: true, message: "User registered successfully", user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Register API error (POST):", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: List All Users 
export async function GET() {
  await connectDB();
  console.log("✅ DB connection confirmed inside register API (GET)");

  try {
    const users = await User.find().select("-password");
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("❌ Register API error (GET):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
