import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Member from "@/models/member";
import { verifyToken } from "@/lib/jwt";


// const requireAdmin = (req) =>{
//   const authHeader = req.headers.get("authorization");
//   if(!authHeader || !authHeader.startsWith("Bearer")){
//     return NextResponse.json(
//       {success:false,message:"Unauthorized: No token provided"},
//       {status:401}
//     );
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = verifyToken(token);

//   if(!decoded){
//     return NextResponse.json(
//       {success:false,message:"Unauthorized:Invalid token"},
//       {status:401}
//     );
//   }

//   if(!["admin","superadmin"].includes(decoded.role)){
//     return NextResponse.json(
//       {success:false,message:"Forbidden"},
//       {status:403}
//     );
//   }

//   return decoded;
// } 

//GET: Fetch all members
export async function GET(req){
  console.log("req",req);

  
    try{
      await connectDB();
        const {searchParams} = new URL(req.url);

        const sortField = searchParams.get("sort") || "createdAt";
        const sortOrder = searchParams.get("order") === "asc" ? 1:-1;

        const filter = {};
        ["name","email","staffNumber","designation","status"].forEach((field)=>{
          const value = searchParams.get(field);
          if(value) filter[field] = value;
        })

        const search = searchParams.get("search");
        if(search){
          filter.$or = [
            {name:{$regex:search,$options:"i"}},
            {email:{$regex:search,$options:"i"}},
            {staffNumber:{$regex:search,$options:"i"}},
            {designation:{$regex:search,$options:"i"}},
            {status:{$regex:search,$options:"i"}},
          ];
        }
        const members = await Member.find(filter).sort({[sortField]:sortOrder});

        console.log("member",members);
        return NextResponse.json({success:true,data:members},{status:200});
    }catch(error){
        return NextResponse.json(
            {success:false,message:"Failed to fetch members",error:error.message},
            {status:500}
        );
    }
}


//POST: Create new member
export async function POST(req) { 

  const decoded = verifyToken(req);
  if(!decoded){
    return NextResponse.json(
      {success:false,error:"Unauhorized"},
      {status:401}
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    if(!body.name || !body.email || !body.staffNumber){
      return NextResponse.json(
        {success:false,message:"Name , email, staff number required"},
        {status:400}
      );
    }

    const newMember = await Member.create({
      userId:decoded.id,
      ...body,
    });

    return NextResponse.json(
      { success: true, message: "Member created successfully", data: newMember },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate staffNumber or email" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to create member", error: error.message },
      { status: 500 }
    );
  }
}