// // src/app/api/auth/login/route.js
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/user";

// export async function POST(req) {
//   await connectDB();
//   console.log(" DB connection confirmed inside login API");

//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { success: false, error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     //  Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { success: false, error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     //  Sign JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" } // token valid for 1 day
//     );

//     // Hide password in response
//     const userResponse = user.toObject();
//     delete userResponse.password;

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Login successful",
//         token,
//         user: userResponse,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(" Login API error:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";

// Handle OPTIONS method for CORS preflight
// export async function OPTIONS() {
//   return NextResponse.json(
//     {},
//     {
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//       },
//     }
//   );
// }

export async function POST(req) {
  await connectDB();
  console.log("DB connection confirmed inside login API");

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Hide password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: userResponse,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}