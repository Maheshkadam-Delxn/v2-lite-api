//  /app/api/project/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Project from "@/models/project";
import bcrypt from 'bcryptjs';
import sendEmail from "@/utils/sendEmail";
//  Create new project
export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();

    //  Auto-generate unique project code
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    const projectCode = `PRJ-${timestamp}-${random}`;

    //  Auto-generate password (8 characters: letters + numbers)
    const plainPassword = Math.random().toString(36).slice(-8);

    //  Hash the password before storing
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(body);
    //  Create project in DB
    const newProject = await Project.create({
      ...body,
      project_code: projectCode,
      password: hashedPassword, // store hashed password (add in schema)
    });


    //  Debug: Check if email exists
    console.log(" Client email received:", body.client_email);


    //  Prepare plain text email body
    const emailBody = `
New Project Created Successfully

Dear ${body.client_name || "Client"},

Your project has been created with the following details:

Project Code: ${projectCode}
Project Name: ${body.project_name}
Description: ${body.project_description || "N/A"}
Location: ${body.location || "N/A"}
Type: ${body.type || "N/A"}
Status: ${body.status || "planned"}
Budget: ${body.budget_amount} ${body.currency || "INR"}
Start Date: ${body.startDate ? new Date(body.startDate).toDateString() : "N/A"
      }
End Date: ${body.endDate ? new Date(body.endDate).toDateString() : "N/A"}

Your login password: ${plainPassword}

Please keep this password secure.

Best regards,
Project Management Team
    `;

    //  Send the email
    if (body.client_email) {
      await sendEmail(
        body.client_email,
        `Project Created: ${body.project_name}`,
        emailBody
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project created and email sent successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const format = searchParams.get("format"); // grid or list (frontend choice)

    let query = {};
    if (status) query.status = status;

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, projects, format });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
