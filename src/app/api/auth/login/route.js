// ✅ src/app/api/auth/login/route.js



/*
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import Role from "@/models/role"

// 🧩 Helper function: Merge role and user permissions
function mergePermissions(rolePermissions = [], userPermissions = []) {
  const merged = [...rolePermissions.map((p) => ({ ...p.toObject() }))];

  for (const up of userPermissions) {
    const index = merged.findIndex((p) => p.module === up.module);
    if (index >= 0) {
      merged[index].access = { ...merged[index].access, ...up.access };
    } else {
      merged.push(up);
    }
  }
  return merged;
}

// 🧠 LOGIN ROUTE
export async function POST(req) {
  await connectDB();
  console.log("✅ [LOGIN API] DB connected successfully");

  try {
    const { email, password } = await req.json();
    console.log("📥 Received login request for:", email);

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 🧩 Find user and populate role permissions
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      console.log("❌ No user found with email:", email);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", user.name);
    console.log("🧠 Role assigned:", user.role?.name || "No role");

    // 🧩 Merge role + user-specific permissions
    const mergedPermissions = mergePermissions(
      user.role?.permissions || [],
      user.userPermissions || []
    );

    console.log("🔀 Final merged permissions count:", mergedPermissions.length);
    console.log(
      "📋 Example permission:",
      mergedPermissions[0] || "No permissions assigned"
    );

    // 🪪 Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role?.name || null,
      permissions: mergedPermissions, // cached permissions
    };

    // 🧾 Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("✅ JWT created successfully");

    // Clean user object before sending
    const userResponse = user.toObject();
    delete userResponse.password;

    //  Send token + user info
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        user: userResponse,
      },
      { status: 200 }
    );

    //  Store token in secure cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    console.log(" Token stored in cookie");
    

    return response;
  } catch (error) {
    console.error("💥 Login API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
*/












































































// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import Role from "@/models/role";

/**
 * Merge role permissions and user-specific permissions.
 * - rolePermissions: array of mongoose docs (or plain objects)
 * - userPermissions: array of plain objects
 */
function mergePermissions(rolePermissions = [], userPermissions = []) {
  // Make plain copies to avoid mutating mongoose docs
  const merged = rolePermissions.map((p) => {
    // if it's a mongoose document, convert to plain object
    if (typeof p.toObject === "function") return p.toObject();
    return { ...p };
  });

  for (const up of userPermissions) {
    const index = merged.findIndex((p) => p.module === up.module);
    if (index >= 0) {
      merged[index].access = { ...merged[index].access, ...up.access };
    } else {
      merged.push({ ...up });
    }
  }

  return merged;
}

export async function POST(req) {
  await connectDB();
  console.log("✅ [LOGIN API] DB connected successfully");

  try {
    const { email, password } = await req.json();
    console.log("📥 Received login request for:", email);

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user and populate role (role should contain permissions)
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      console.log("❌ No user found with email:", email);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password securely
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", user.name || user.email);
    console.log("🧠 Role assigned:", user.role?.name || user.role?.roleName || "No role");

    // If role exists and role.permissions are refs, ensure nested populate
    if (user.role && user.role.permissions && user.role.permissions.length > 0) {
      // If permissions are objectIds (refs), try to populate them as well.
      // If they're already embedded, populate will be a no-op.
      try {
        await user.populate({
          path: "role",
          populate: { path: "permissions" },
        });
      } catch (e) {
        // ignore populate errors — permissions might already be embedded
      }
    }

    // Merge role permissions + user-specific permissions (if any)
    const mergedPermissions = mergePermissions(
      user.role?.permissions || [],
      user.userPermissions || []
    );

    console.log("🔀 Final merged permissions count:", mergedPermissions.length);
    console.log(
      "📋 Example permission:",
      mergedPermissions[0] || "No permissions assigned"
    );

    // For clearer terminal logs, convert _id to string (if present)
    const mergedPermissionsPrintable = mergedPermissions.map((p) => {
      const copy = { ...p };
      if (copy._id && typeof copy._id.toString === "function") {
        copy._id = copy._id.toString();
      }
      // ensure access object is plain
      if (copy.access && typeof copy.access.toObject === "function") {
        copy.access = copy.access.toObject();
      }
      return copy;
    });

    // Log full role object (safe) and full merged permissions
    console.log("🔍 Populated Role Details:", JSON.stringify(user.role || {}, null, 2));
    console.log("✅ Merged Permissions (full):", JSON.stringify(mergedPermissionsPrintable, null, 2));

    // Create JWT payload (don't include raw password)
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role?.name || user.role?.roleName || null,
      permissions: mergedPermissionsPrintable,
    };

    // Generate token
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT secret not configured (process.env.JWT_SECRET)");
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("✅ JWT created successfully");

    // Clean user object before sending
    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.password;

    // Include merged permissions in userResponse (so client sees merged permissions)
    userResponse.mergedPermissions = mergedPermissionsPrintable;

    // Build response body
    const responseBody = {
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    };

    // Create NextResponse and set secure cookie (HttpOnly)
    const response = NextResponse.json(responseBody, { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // change to 'strict' if you do not need cross-site cookie usage
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
    });

    console.log("🍪 Token stored in cookie (HttpOnly)");
    // Safe final response log (avoid printing the raw token)
    console.log(
      "✅ Final response (safe):",
      JSON.stringify(
        {
          success: responseBody.success,
          message: responseBody.message,
          user: {
            _id: userResponse._id?.toString?.() || userResponse._id,
            name: userResponse.name,
            email: userResponse.email,
            role: payload.role,
            permissionsCount: mergedPermissionsPrintable.length,
          },
        },
        null,
        2
      )
    );

    return response;
  } catch (error) {
    console.error("💥 Login API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
