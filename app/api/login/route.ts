import users from "@/data/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface userDetails {
  username: string;
  password: string;
}

const loginFormSchema = z.object({
  username:z.string(),
  password:z.string().min(8)
})

export async function POST(req: NextRequest) {
  const JWT_SECRETE: any = process.env.JWT_SECRETE;
  const { username, password } = await req.json();
  const result = loginFormSchema.safeParse({username,password});
  if(!result.success){
    return NextResponse.json(
      {
        message: "zod validation failed",
      },
      {
        status: 401,
      }
    )
  }
  const user: userDetails | undefined = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return NextResponse.json(
      {
        message: "Invalid credentials",
      },
      {
        status: 401,
      }
    );
  }
  const token = await jwt.sign({ username: user?.username }, JWT_SECRETE, {
    expiresIn: "2h",
  });
  cookies().set("authToken", token);
  return NextResponse.json({
    token
  },{
    status:200
  })
}
